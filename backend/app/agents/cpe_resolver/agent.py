from pydantic import BaseModel, Field

from app.agents.base import BaseAgent
from app.llm.base import LLMProvider
from app.schemas.cve import CPE
from app.schemas.entity import Entity


class CPEResolverAgentRequest(BaseModel):
    """Request schema for CPE resolver agent."""

    entity_data: Entity


class CPEResolverAgentResponse(BaseModel):
    """Response schema for CPE resolver agent."""

    cpes: list[CPE] = Field(..., description="List of generated CPE identifiers")


class CPEResolverAgent(BaseAgent):
    input_model = CPEResolverAgentRequest
    output_model = CPEResolverAgentResponse

    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider)

    async def execute(self, input_data: CPEResolverAgentRequest) -> CPEResolverAgentResponse:
        return await super().execute(input_data)
