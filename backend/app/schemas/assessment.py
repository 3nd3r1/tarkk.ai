from enum import Enum

from pydantic import UUID1, BaseModel, Field

from app.schemas.entity import Entity


class AssessmentInputData(BaseModel):
    """Schema representing the input data for generating an assessment."""

    name: str = Field(..., description="The name of the product")
    vendor_name: str = Field(..., description="The name of the vendor")
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
    id: UUID1 = Field(..., description="The unique identifier for the assessment")

    input_data: AssessmentInputData = Field(
        ..., description="The input data used to generate the assessment"
    )

    assessment_type: AssessmentType = Field(..., description="The type of assessment performed")
    assessment_status: AssessmentStatus = Field(
        ..., description="The current status of the assessment"
    )

    entity: Entity | None = None
