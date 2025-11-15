from uuid import uuid1

from pydantic import UUID1

from app.agents.base import AgentError
from app.agents.entity_resolution import EntityResolutionAgent
from app.agents.entity_resolution.agent import EntityResolutionAgentRequest
from app.llm.factory import LLMProviderFactory, LLMProviderType
from app.schemas.assessment import Assessment, AssessmentInputData, AssessmentStatus, AssessmentType
from app.schemas.entity import Entity


class AssessmentServiceError(Exception):
    """Custom exception for AssessmentService errors."""


class AssessmentServiceAgentError(AssessmentServiceError):
    """Exception raised for errors in the agent processing within AssessmentService."""


class AssessmentService:
    def __init__(self):
        llm_provider = LLMProviderFactory.create_provider(LLMProviderType.GEMINI)

        self.entitiy_resolution_agent = EntityResolutionAgent(llm_provider)

    async def create_assessment(
        self, input_data: AssessmentInputData, assessment_type: AssessmentType
    ) -> Assessment:
        return Assessment(
            id=uuid1(),
            input_data=input_data,
            assessment_type=assessment_type,
            assessment_status=AssessmentStatus.QUEUED,
        )

    async def process_assessment(self, assessment_id: UUID1) -> None:
        pass

    async def _call_entity_resolution_agent(self, input_data: AssessmentInputData) -> Entity:
        try:
            request = EntityResolutionAgentRequest(
                input_data=input_data,
            )
            response = await self.entitiy_resolution_agent.execute(request)
            return response.resolved_entity
        except AgentError as e:
            raise AssessmentServiceAgentError(f"Entity resolution failed: {e}") from e
