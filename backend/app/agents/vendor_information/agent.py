from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.llm.base import LLMProvider
from app.schemas.entity import Entity
from app.schemas.vendor import Vendor


class VendorInformationAgentRequest(BaseModel):
    """Request schema for vendor information agent."""

    entity: Entity


class VendorInformationAgentResponse(BaseModel):
    """Response schema for vendor information agent."""

    vendor: Vendor


class VendorInformationAgent(BaseAgent):
    input_model = VendorInformationAgentRequest
    output_model = VendorInformationAgentResponse

    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider, max_tokens=4096)

    async def execute(
        self, input_data: VendorInformationAgentRequest
    ) -> VendorInformationAgentResponse:
        return await super().execute(input_data)
