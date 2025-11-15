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


class CVE(BaseModel):
    id: str = Field(..., description="CVE ID (e.g., CVE-2023-1234)")
    description: str = Field(..., description="CVE description")
    published: datetime = Field(..., description="Publication date")
    severity: CVESeverity = Field(..., description="CVSS severity")
    score: float | None = Field(None, description="CVSS base score")
