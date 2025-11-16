from enum import Enum

from pydantic import BaseModel, Field


class TrustScoreLevel(str, Enum):
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"


class TrustScoreCategory(str, Enum):
    SECURITY = "security"
    PRIVACY = "privacy"
    COMPLIANCE = "compliance"
    VENDOR_REPUTATION = "vendor_reputation"
    DATA_HANDLING = "data_handling"
    TRANSPARENCY = "transparency"
    BUSINESS_CONTINUITY = "business_continuity"
    TECHNICAL_RELIABILITY = "technical_reliability"


class CategoryScore(BaseModel):
    score: float = Field(..., ge=0, le=100, description="Score from 0-100 for this category")
    level: TrustScoreLevel = Field(..., description="Trust level for this category")
    reasoning: str = Field(..., description="Explanation for this category's score")
    key_factors: list[str] = Field(..., description="Key factors that influenced this score")
    risks: list[str] = Field(default=[], description="Identified risks in this category")
    strengths: list[str] = Field(default=[], description="Identified strengths in this category")


class TrustScore(BaseModel):
    overall_score: float = Field(..., ge=0, le=100, description="Overall trust score from 0-100")
    overall_level: TrustScoreLevel = Field(..., description="Overall trust level")

    category_scores: dict[TrustScoreCategory, CategoryScore] = Field(
        ..., description="Detailed scores for each trust category"
    )

    summary: str = Field(..., description="High-level summary of the trust assessment")
    key_recommendations: list[str] = Field(
        default=[], description="Key recommendations for improving trust"
    )

    confidence_score: float = Field(
        ..., ge=0, le=100, description="Confidence in the assessment accuracy"
    )
    assessment_limitations: list[str] = Field(
        default=[], description="Limitations or gaps in the assessment"
    )
