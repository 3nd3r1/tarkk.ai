from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class CPE(BaseModel):
    """Common Platform Enumeration identifier."""

    vendor: str = Field(..., description="Vendor name for CPE")
    product: str = Field(..., description="Product name for CPE")
    full_cpe: str = Field(
        ..., description="Full CPE string (e.g., 'cpe:2.3:a:slack:slack:*:*:*:*:*:*:*:*')"
    )


class CVESeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    NONE = "NONE"


class CVEStatus(str, Enum):
    RECEIVED = "Received"
    AWAITING_ANALYSIS = "Awaiting Analysis"
    UNDERGOING_ANALYSIS = "Undergoing Analysis"
    MODIFIED = "Modified"
    PUBLISHED = "Published"
    REJECTED = "Rejected"
    DEFERRED = "Deferred"


class CVSS(BaseModel):
    version: str = Field(..., description="CVSS version (e.g., '3.1')")
    vector_string: str = Field(..., description="CVSS vector string")
    base_score: float = Field(..., description="CVSS base score")
    base_severity: CVESeverity = Field(..., description="CVSS base severity")


class CVEReference(BaseModel):
    url: str = Field(..., description="Reference URL")
    source: str | None = Field(None, description="Reference source")
    tags: list[str] = Field(default_factory=list, description="Reference tags")


class CVEDescription(BaseModel):
    lang: str = Field(..., description="Language code")
    value: str = Field(..., description="Description text")


class CVEVendorProduct(BaseModel):
    vendor: str = Field(..., description="Vendor name")
    product: str = Field(..., description="Product name")
    version: str | None = Field(None, description="Product version")
    version_start_including: str | None = Field(None, description="Version range start (inclusive)")
    version_end_including: str | None = Field(None, description="Version range end (inclusive)")
    version_start_excluding: str | None = Field(None, description="Version range start (exclusive)")
    version_end_excluding: str | None = Field(None, description="Version range end (exclusive)")


class CVE(BaseModel):
    id: str = Field(..., description="CVE ID (e.g., CVE-2023-1234)")
    source_identifier: str = Field(..., description="Source identifier")
    published: datetime = Field(..., description="Publication date")
    last_modified: datetime = Field(..., description="Last modification date")
    vuln_status: CVEStatus = Field(..., description="CVE status")
    descriptions: list[CVEDescription] = Field(..., description="CVE descriptions")
    cvss_v3: CVSS | None = Field(None, description="CVSS v3 metrics")
    cvss_v2: CVSS | None = Field(None, description="CVSS v2 metrics")
    references: list[CVEReference] = Field(default_factory=list, description="References")
    affected_products: list[CVEVendorProduct] = Field(
        default_factory=list, description="Affected vendor/products"
    )
    cwe_ids: list[str] = Field(default_factory=list, description="CWE IDs")
