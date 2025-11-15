from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.llm.base import LLMProvider


class EntityResolutionAgentRequest(BaseModel):
    """Request schema for entity resolution agent."""


class EntityResolutionAgentResponse(BaseModel):
    """Response schema for entity resolution agent."""


class EntityResolutionAgent(BaseAgent):
    input_model = EntityResolutionAgentRequest
    output_model = EntityResolutionAgentResponse

    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider)

    async def execute(
        self, input_data: EntityResolutionAgentRequest
    ) -> EntityResolutionAgentResponse:
        return await super().execute(input_data)
