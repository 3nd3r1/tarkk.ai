import logging

from pydantic import UUID1
from sqlalchemy.orm import Session

from app.agents.base import AgentError
from app.agents.entity_resolution import EntityResolutionAgent
from app.agents.entity_resolution.agent import EntityResolutionAgentRequest
from app.database import get_db
from app.llm.factory import LLMProviderFactory, LLMProviderType
from app.models.assessment import Assessment as AssessmentModel
from app.schemas.assessment import Assessment, AssessmentInputData, AssessmentStatus, AssessmentType
from app.schemas.entity import Entity


class AssessmentServiceError(Exception):
    """Custom exception for AssessmentService errors."""


class AssessmentServiceAgentError(AssessmentServiceError):
    """Exception raised for errors in the agent processing within AssessmentService."""


class AssessmentServiceValidationError(AssessmentServiceError):
    """Exception raised for validation errors in AssessmentService."""


class AssessmentService:
    def __init__(self, db: Session | None = None):
        llm_provider = LLMProviderFactory.create_provider(LLMProviderType.GEMINI)
        self.entitiy_resolution_agent = EntityResolutionAgent(llm_provider)
        self.__db = db

    def _get_db(self) -> Session:
        if self.__db:
            return self.__db
        return next(get_db())

    async def create_assessment(
        self, input_data: AssessmentInputData, assessment_type: AssessmentType
    ) -> Assessment:
        db = self._get_db()

        db_assessment = AssessmentModel(
            input_name=input_data.name,
            input_vendor_name=input_data.vendor_name,
            input_url=input_data.url,
            assessment_type=assessment_type,
            assessment_status=AssessmentStatus.QUEUED,
        )

        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)

        return Assessment.from_model(db_assessment)

    async def get_assessment(self, assessment_id: UUID1) -> Assessment | None:
        """Fetch assessment from database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == assessment_id).first()
        )

        if not db_assessment:
            return None

        return Assessment.from_model(db_assessment)

    async def update_assessment_status(self, assessment_id: UUID1, status: AssessmentStatus) -> bool:
        """Update assessment status in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == assessment_id).first()
        )
        if not db_assessment:
            return False

        db_assessment.assessment_status = status
        db.commit()
        return True

    async def update_assessment_entity(self, assessment_id: UUID1, entity: Entity) -> bool:
        """Update assessment entity data in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == assessment_id).first()
        )
        if not db_assessment:
            return False

        db_assessment.entity_data = entity.model_dump()
        db.commit()
        return True

    async def process_assessment(self, assessment_id: UUID1) -> None:
        """Process the assessment in the background."""
        try:
            logging.info(f"Starting background processing for assessment {assessment_id}")

            await self.update_assessment_status(assessment_id, AssessmentStatus.IN_PROGRESS)

            assessment = await self.get_assessment(assessment_id)
            if not assessment:
                logging.error(f"Assessment {assessment_id} not found")
                return

            try:
                entity = await self._call_entity_resolution_agent(assessment.input_data)
                await self.update_assessment_entity(assessment_id, entity)
            except AssessmentServiceAgentError as e:
                logging.error(f"Entity resolution failed for {assessment_id}: {e}")
                await self.update_assessment_status(assessment_id, AssessmentStatus.FAILED)
                return

            await self.update_assessment_status(assessment_id, AssessmentStatus.COMPLETED)
            logging.info(f"Background processing completed for assessment {assessment_id}")

        except Exception as e:
            logging.error(f"Error processing assessment {assessment_id}: {e}")
            await self.update_assessment_status(assessment_id, AssessmentStatus.FAILED)

    async def _call_entity_resolution_agent(self, input_data: AssessmentInputData) -> Entity:
        try:
            request = EntityResolutionAgentRequest(
                input_data=input_data,
            )
            response = await self.entitiy_resolution_agent.execute(request)
            return response.resolved_entity
        except AgentError as e:
            raise AssessmentServiceAgentError(f"Entity resolution failed: {e}") from e
