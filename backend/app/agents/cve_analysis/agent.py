from pydantic import BaseModel, Field

from app.agents.base import BaseAgent
from app.llm.base import LLMProvider
from app.schemas.cve import CVE
from app.schemas.entity import Entity


class CVEAnalysisAgentRequest(BaseModel):
    """Request schema for CVE analysis agent."""

    entity: Entity = Field(..., description="The entity being analyzed")
    cves: list[CVE] = Field(..., description="List of CVEs to analyze")


class CVEAnalysisAgentResponse(BaseModel):
    """Response schema for CVE analysis agent."""

    risk_assessment: str = Field(..., description="Overall risk assessment summary")
    critical_vulnerabilities: list[str] = Field(
        ..., description="List of critical vulnerability IDs"
    )
    recommendations: list[str] = Field(..., description="Security recommendations")
    severity_breakdown: dict[str, int] = Field(..., description="Count of CVEs by severity level")
    total_cves: int = Field(..., description="Total number of CVEs analyzed")


class CVEAnalysisAgent(BaseAgent):
    input_model = CVEAnalysisAgentRequest
    output_model = CVEAnalysisAgentResponse

    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider, max_tokens=100192)

    async def execute(self, input_data: CVEAnalysisAgentRequest) -> CVEAnalysisAgentResponse:
        return await super().execute(input_data)
