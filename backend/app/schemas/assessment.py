from pydantic import BaseModel, Field

from app.schemas.entity import Entity


class AssesmentInputData(BaseModel):
    """Schema representing the input data for generating an assessment."""

    name: str = Field(..., description="The name of the product")
    vendor_name: str = Field(..., description="The name of the vendor")
    url: str | None = Field(None, description="The product's website URL")


class Assesment(BaseModel):
    id: str = Field(..., description="The unique identifier for the assessment")
    entity: Entity = Field(..., description="The entity being assessed")
