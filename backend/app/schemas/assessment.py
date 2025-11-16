from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.cve import CVEAnalysis
from app.schemas.entity import Entity
from app.schemas.trust_score import TrustScore
from app.schemas.vendor import Vendor

if TYPE_CHECKING:
    from app.models.assessment import Assessment as AssessmentModel


class AssessmentInputData(BaseModel):
    """Schema representing the input data for generating an assessment."""

    name: str = Field(..., description="The name of the product")
    vendor_name: str | None = None
    url: str | None = None


class AssessmentStatus(str, Enum):
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class AssessmentType(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class Assessment(BaseModel):
    id: UUID = Field(..., description="The unique identifier for the assessment")

    input_data: AssessmentInputData = Field(
        ..., description="The input data used to generate the assessment"
    )

    assessment_type: AssessmentType = Field(..., description="The type of assessment performed")
    assessment_status: AssessmentStatus = Field(
        ..., description="The current status of the assessment"
    )

    entity: Entity | None = None
    vendor: Vendor | None = None
    cve_analysis: CVEAnalysis | None = None
    trust_score: TrustScore | None = None

    @classmethod
    def from_model(cls, db_assessment: "AssessmentModel") -> "Assessment":
        input_data = AssessmentInputData(
            name=str(db_assessment.input_name),
            vendor_name=str(db_assessment.input_vendor_name)
            if db_assessment.input_vendor_name is not None
            else None,
            url=str(db_assessment.input_url) if db_assessment.input_url is not None else None,
        )

        entity = None
        if db_assessment.entity_data is not None:
            entity = Entity.model_validate(db_assessment.entity_data)

        vendor = None
        if db_assessment.vendor_data is not None:
            vendor = Vendor.model_validate(db_assessment.vendor_data)

        cve_analysis = None
        if db_assessment.cve_analysis_data is not None:
            cve_analysis = CVEAnalysis.model_validate(db_assessment.cve_analysis_data)

        trust_score = None
        if db_assessment.trust_score_data is not None:
            trust_score = TrustScore.model_validate(db_assessment.trust_score_data)

        return cls(
            id=UUID(str(db_assessment.id)),
            input_data=input_data,
            assessment_type=AssessmentType(db_assessment.assessment_type),
            assessment_status=AssessmentStatus(db_assessment.assessment_status),
            entity=entity,
            vendor=vendor,
            cve_analysis=cve_analysis,
            trust_score=trust_score,
        )
