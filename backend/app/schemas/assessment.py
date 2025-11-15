from pydantic import BaseModel, Field

from app.schemas.entity import Entity


class Assesment(BaseModel):
    id: str = Field(..., description="The unique identifier for the assessment")
    entity: Entity = Field(..., description="The entity being assessed")
