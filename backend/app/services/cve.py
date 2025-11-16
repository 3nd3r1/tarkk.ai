from datetime import datetime
import logging
from typing import Any

import httpx

from app.config import settings
from app.schemas.cve import CVE, CVESeverity

logger = logging.getLogger(__name__)


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

    async def test_api_connection(self) -> bool:
        """Test if the NVD API is accessible."""
        try:
            params = {"resultsPerPage": 1, "startIndex": 0}
            headers = self._build_headers()
            response = await self._client.get(self._base_url, params=params, headers=headers)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Failed to test API connection: {e}")
            return False

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

            logger.debug(f"Searching CVEs with params: {params}")
            logger.debug(f"Making request to: {self._base_url}")

            response = await self._client.get(self._base_url, params=params, headers=headers)

            logger.debug(f"Response status: {response.status_code}")
            logger.debug(f"Response URL: {response.url}")

            if response.status_code == 404:
                logger.warning(f"API returned 404 for params: {params}")
                return []  # Return empty list instead of raising error
            elif response.status_code == 403:
                logger.error(
                    "API returned 403 - Rate limited or forbidden. Consider adding API key."
                )
                return []
            elif response.status_code == 503:
                logger.error("API returned 503 - Service unavailable")
                return []

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
            # Use keywordSearch for better results with vendor:product combination
            params["keywordSearch"] = f"{vendor} {product}"
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
                logger.warning(f"Failed to parse CVE {cve_data.get('id', 'unknown')}: {e}")
                continue

        return cves

    def _parse_cve_item(self, cve_data: dict[str, Any]) -> CVE:
        """Parse a single CVE item from the NVD API response."""
        cve_id = cve_data.get("id", "")

        # Get publication date
        published_str = cve_data.get("published", "")
        published = datetime.fromisoformat(published_str.replace("Z", "+00:00"))

        # Get English description
        description = "No description available"
        for desc_data in cve_data.get("descriptions", []):
            if desc_data.get("lang") == "en":
                description = desc_data.get("value", "No description available")
                break

        # Get CVSS severity and score (prefer v3 over v2)
        severity = CVESeverity.NONE
        score = None

        metrics = cve_data.get("metrics", {})
        if "cvssMetricV31" in metrics and metrics["cvssMetricV31"]:
            cvss_data = metrics["cvssMetricV31"][0]["cvssData"]
            severity = CVESeverity(cvss_data.get("baseSeverity", "NONE"))
            score = cvss_data.get("baseScore")
        elif "cvssMetricV30" in metrics and metrics["cvssMetricV30"]:
            cvss_data = metrics["cvssMetricV30"][0]["cvssData"]
            severity = CVESeverity(cvss_data.get("baseSeverity", "NONE"))
            score = cvss_data.get("baseScore")
        elif "cvssMetricV2" in metrics and metrics["cvssMetricV2"]:
            cvss_data = metrics["cvssMetricV2"][0]["cvssData"]
            score = cvss_data.get("baseScore")
            # Convert v2 score to severity approximation
            if score is not None:
                if score >= 7.0:
                    severity = CVESeverity.HIGH
                elif score >= 4.0:
                    severity = CVESeverity.MEDIUM
                else:
                    severity = CVESeverity.LOW

        return CVE(
            id=cve_id,
            description=description,
            published=published,
            severity=severity,
            score=score,
        )
