from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.vendor import Vendor


class EntityCategory(str, Enum):
    FILESHARING = "filesharing"
    CHAT = "chat"
    GEN_AI_TOOL = "gen_ai_tool"
    CRM = "crm"


class Entity(BaseModel):
    name: str = Field(..., description="The name of the product")
    vendor: Vendor = Field(..., description="The vendor of the product")
    category: EntityCategory = Field(..., description="The category of the product")
    description: str = Field(..., description="A brief description of the product")
    usage: str = Field(..., description="How the product is typically used")
    website: str | None = Field(None, description="The product's website URL")
    logo_url: str | None = Field(None, description="URL to the product's logo image")
