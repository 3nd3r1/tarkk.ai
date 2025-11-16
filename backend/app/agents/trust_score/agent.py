from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.llm.base import LLMProvider
from app.schemas.cve import CVEAnalysis
from app.schemas.entity import Entity
from app.schemas.trust_score import TrustScore
from app.schemas.vendor import Vendor


class TrustScoreAgentRequest(BaseModel):
    """Request schema for trust score agent."""

    entity: Entity
    vendor: Vendor | None = None
    cve_analysis: CVEAnalysis | None = None
    additional_context: str | None = None


class TrustScoreAgentResponse(BaseModel):
    """Response schema for trust score agent."""

    trust_score: TrustScore


class TrustScoreAgent(BaseAgent):
    input_model = TrustScoreAgentRequest
    output_model = TrustScoreAgentResponse

    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider, max_tokens=150000)

    async def execute(self, input_data: TrustScoreAgentRequest) -> TrustScoreAgentResponse:
        return await super().execute(input_data)
