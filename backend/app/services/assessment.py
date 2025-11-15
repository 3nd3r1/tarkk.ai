from app.agents.base import AgentError
from app.agents.entity_resolution import EntityResolutionAgent
from app.agents.entity_resolution.agent import EntityResolutionAgentRequest
from app.llm.factory import LLMProviderFactory, LLMProviderType
from app.schemas.assessment import Assesment
from app.schemas.entity import Entity, EntityData
from app.schemas.report import ReportType


class AssessmentServiceError(Exception):
    """Custom exception for AssessmentService errors."""


class AssessmentServiceAgentError(AssessmentServiceError):
    """Exception raised for errors in the agent processing within AssessmentService."""


class AssessmentService:
    def __init__(self):
        llm_provider = LLMProviderFactory.create_provider(LLMProviderType.GEMINI)

        self.entitiy_resolution_agent = EntityResolutionAgent(llm_provider)

    async def create_assessment(
        self, entity_data: EntityData, report_type: ReportType
    ) -> Assesment:
        entity = await self._call_entity_resolution_agent(entity_data)
        return Assesment(
            id="assessment_123",
            entity=entity,
        )

    async def _call_entity_resolution_agent(self, entity_data: EntityData) -> Entity:
        try:
            request = EntityResolutionAgentRequest(
                entity_data=entity_data,
            )
            response = await self.entitiy_resolution_agent.execute(request)
            return response.resolved_entity
        except AgentError as e:
            raise AssessmentServiceAgentError(f"Entity resolution failed: {e}") from e
