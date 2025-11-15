from pydantic import BaseModel, Field


class Vendor(BaseModel):
    name: str = Field(..., description="The name of the vendor")
    website: str | None = Field(None, description="The vendor's website URL")
