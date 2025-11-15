from datetime import datetime
import logging
from typing import Any

import httpx

from app.config import settings
from app.schemas.cve import (
    CVE,
    CVSS,
    CVEDescription,
    CVEReference,
    CVESeverity,
    CVEStatus,
    CVEVendorProduct,
)


class CVEServiceError(Exception):
    """Custom exception for CVEService errors."""


class CVEServiceAPIError(CVEServiceError):
    """Exception raised for API errors in CVEService."""


class CVEService:
    """Service for fetching CVE data from NIST NVD API."""

    def __init__(self):
        self._base_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
        self._api_key = getattr(settings, "NVD_API_KEY", None)
        self._client = httpx.AsyncClient(timeout=30.0)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._client.aclose()

    async def get_cves(
        self,
        vendor: str | None = None,
        product: str | None = None,
        cve_id: str | None = None,
        severity: CVESeverity | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[CVE]:
        """Get CVEs by vendor and/or product."""
        try:
            params = self._build_search_params(vendor, product, cve_id, severity, limit, offset)
            headers = self._build_headers()

            logging.debug(f"Searching CVEs with params: {params}")

            response = await self._client.get(self._base_url, params=params, headers=headers)
            response.raise_for_status()

            data = response.json()
            return self._parse_nvd_response(data)

        except httpx.HTTPError as e:
            raise CVEServiceAPIError(f"Failed to fetch CVEs: {e}") from e
        except Exception as e:
            raise CVEServiceError(f"Unexpected error searching CVEs: {e}") from e

    def _build_search_params(
        self,
        vendor: str | None,
        product: str | None,
        cve_id: str | None,
        severity: CVESeverity | None,
        limit: int,
        offset: int,
    ) -> dict[str, Any]:
        """Build query parameters for the NVD API request."""
        params: dict[str, Any] = {
            "resultsPerPage": limit,
            "startIndex": offset,
        }

        if cve_id:
            params["cveId"] = cve_id

        if vendor and product:
            params["cpeName"] = f"cpe:2.3:*:*:{vendor}:{product}:*:*:*:*:*:*:*"
        elif vendor:
            params["keywordSearch"] = vendor
        elif product:
            params["keywordSearch"] = product

        if severity:
            params["cvssV3Severity"] = severity.value

        return params

    def _build_headers(self) -> dict[str, str]:
        """Build headers for the NVD API request."""
        headers = {"Accept": "application/json"}
        if self._api_key:
            headers["apiKey"] = self._api_key
        return headers

    def _parse_nvd_response(self, data: dict[str, Any]) -> list[CVE]:
        """Parse the response from the NVD API into our schema."""
        cves = []
        vulnerabilities = data.get("vulnerabilities", [])

        for vuln_data in vulnerabilities:
            cve_data = vuln_data.get("cve", {})
            try:
                cve = self._parse_cve_item(cve_data)
                cves.append(cve)
            except Exception as e:
                logging.warning(f"Failed to parse CVE {cve_data.get('id', 'unknown')}: {e}")
                continue

        return cves

    def _parse_cve_item(self, cve_data: dict[str, Any]) -> CVE:
        """Parse a single CVE item from the NVD API response."""
        cve_id = cve_data.get("id", "")
        source_identifier = cve_data.get("sourceIdentifier", "")

        published_str = cve_data.get("published", "")
        last_modified_str = cve_data.get("lastModified", "")

        published = datetime.fromisoformat(published_str.replace("Z", "+00:00"))
        last_modified = datetime.fromisoformat(last_modified_str.replace("Z", "+00:00"))

        vuln_status = CVEStatus(cve_data.get("vulnStatus", "PUBLISHED"))

        # Parse descriptions
        descriptions = []
        for desc_data in cve_data.get("descriptions", []):
            descriptions.append(
                CVEDescription(
                    lang=desc_data.get("lang", "en"),
                    value=desc_data.get("value", ""),
                )
            )

        # Parse CVSS metrics
        cvss_v3 = None
        cvss_v2 = None
        metrics = cve_data.get("metrics", {})

        if "cvssMetricV31" in metrics and metrics["cvssMetricV31"]:
            cvss_data = metrics["cvssMetricV31"][0]["cvssData"]
            cvss_v3 = CVSS(
                version=cvss_data.get("version", "3.1"),
                vector_string=cvss_data.get("vectorString", ""),
                base_score=cvss_data.get("baseScore", 0.0),
                base_severity=CVESeverity(cvss_data.get("baseSeverity", "NONE")),
            )

        if "cvssMetricV2" in metrics and metrics["cvssMetricV2"]:
            cvss_data = metrics["cvssMetricV2"][0]["cvssData"]
            cvss_v2 = CVSS(
                version=cvss_data.get("version", "2.0"),
                vector_string=cvss_data.get("vectorString", ""),
                base_score=cvss_data.get("baseScore", 0.0),
                base_severity=CVESeverity(cvss_data.get("baseSeverity", "NONE")),
            )

        # Parse references
        references = []
        for ref_data in cve_data.get("references", []):
            references.append(
                CVEReference(
                    url=ref_data.get("url", ""),
                    source=ref_data.get("source"),
                    tags=ref_data.get("tags", []),
                )
            )

        # Parse affected products
        affected_products = []
        for config in cve_data.get("configurations", []):
            for node in config.get("nodes", []):
                for cpe_match in node.get("cpeMatch", []):
                    cpe_name = cpe_match.get("criteria", "")
                    if cpe_name:
                        # Parse CPE name format: cpe:2.3:a:vendor:product:version:...
                        cpe_parts = cpe_name.split(":")
                        if len(cpe_parts) >= 5:
                            vendor = cpe_parts[3] if cpe_parts[3] != "*" else ""
                            product = cpe_parts[4] if cpe_parts[4] != "*" else ""
                            version = cpe_parts[5] if cpe_parts[5] != "*" else None

                            if vendor or product:
                                affected_products.append(
                                    CVEVendorProduct(
                                        vendor=vendor,
                                        product=product,
                                        version=version,
                                        version_start_including=cpe_match.get(
                                            "versionStartIncluding"
                                        ),
                                        version_end_including=cpe_match.get("versionEndIncluding"),
                                        version_start_excluding=cpe_match.get(
                                            "versionStartExcluding"
                                        ),
                                        version_end_excluding=cpe_match.get("versionEndExcluding"),
                                    )
                                )

        # Parse CWE IDs
        cwe_ids = []
        for weakness in cve_data.get("weaknesses", []):
            for desc in weakness.get("description", []):
                if desc.get("lang") == "en":
                    cwe_id = desc.get("value", "")
                    if cwe_id.startswith("CWE-"):
                        cwe_ids.append(cwe_id)

        return CVE(
            id=cve_id,
            source_identifier=source_identifier,
            published=published,
            last_modified=last_modified,
            vuln_status=vuln_status,
            descriptions=descriptions,
            cvss_v3=cvss_v3,
            cvss_v2=cvss_v2,
            references=references,
            affected_products=affected_products,
            cwe_ids=cwe_ids,
        )
