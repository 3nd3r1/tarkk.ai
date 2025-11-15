import logging
from uuid import UUID

from sqlalchemy.orm import Session

from app.agents.base import AgentError
from app.agents.cpe_resolver import CPEResolverAgent
from app.agents.cpe_resolver.agent import CPEResolverAgentRequest
from app.agents.cve_analysis import CVEAnalysisAgent
from app.agents.cve_analysis.agent import CVEAnalysisAgentRequest
from app.agents.entity_resolution import EntityResolutionAgent
from app.agents.entity_resolution.agent import EntityResolutionAgentRequest
from app.agents.vendor_information import VendorInformationAgent
from app.agents.vendor_information.agent import VendorInformationAgentRequest
from app.database import get_db
from app.llm.factory import LLMProviderFactory, LLMProviderType
from app.models.assessment import Assessment as AssessmentModel
from app.schemas.assessment import Assessment, AssessmentInputData, AssessmentStatus, AssessmentType
from app.schemas.entity import Entity
from app.schemas.vendor import Vendor
from app.services.cve import CVEService


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
        self.vendor_information_agent = VendorInformationAgent(llm_provider)
        self.cpe_resolver_agent = CPEResolverAgent(llm_provider)
        self.cve_analysis_agent = CVEAnalysisAgent(llm_provider)
        self.cve_service = CVEService()
        self.__db = db

    def _get_db(self) -> Session:
        if self.__db:
            return self.__db
        return next(get_db())

    async def create_assessment(
        self, input_data: AssessmentInputData, assessment_type: AssessmentType
    ) -> Assessment:
        # Check if assessment with same name already exists
        existing_assessment = await self.get_assessment_by_name(input_data.name)
        if existing_assessment:
            return existing_assessment

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

    async def get_assessment(self, assessment_id: UUID) -> Assessment | None:
        """Fetch assessment from database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == str(assessment_id)).first()
        )

        if not db_assessment:
            return None

        return Assessment.from_model(db_assessment)

    async def get_assessments(self) -> list[Assessment]:
        """Fetch all assessments from database."""
        db = self._get_db()

        db_assessments = db.query(AssessmentModel).all()

        return [Assessment.from_model(db_assessment) for db_assessment in db_assessments]

    async def get_assessment_by_name(self, name: str) -> Assessment | None:
        """Fetch assessment by input name from database."""
        db = self._get_db()

        db_assessment = db.query(AssessmentModel).filter(AssessmentModel.input_name == name).first()

        if not db_assessment:
            return None

        return Assessment.from_model(db_assessment)

    async def update_assessment_status(self, assessment_id: UUID, status: AssessmentStatus) -> bool:
        """Update assessment status in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == str(assessment_id)).first()
        )
        if not db_assessment:
            return False

        db_assessment.assessment_status = status
        db.commit()
        return True

    async def update_assessment_entity(self, assessment_id: UUID, entity: Entity) -> bool:
        """Update assessment entity data in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == str(assessment_id)).first()
        )
        if not db_assessment:
            return False

        db_assessment.entity_data = entity.model_dump()
        db.commit()
        return True

    async def update_assessment_vendor(self, assessment_id: UUID, vendor: Vendor) -> bool:
        """Update assessment vendor information data in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == str(assessment_id)).first()
        )
        if not db_assessment:
            return False

        db_assessment.vendor_data = vendor.model_dump()
        db.commit()
        return True

    async def update_assessment_cve_analysis(self, assessment_id: UUID, cve_analysis: dict) -> bool:
        """Update assessment CVE analysis data in database."""
        db = self._get_db()

        db_assessment = (
            db.query(AssessmentModel).filter(AssessmentModel.id == str(assessment_id)).first()
        )
        if not db_assessment:
            return False

        db_assessment.cve_analysis_data = cve_analysis
        db.commit()
        return True

    async def process_assessment(self, assessment_id: UUID) -> None:
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

                vendor_info = await self._call_vendor_information_agent(entity)
                await self.update_assessment_vendor(assessment_id, vendor_info)

                # Get CPEs for the entity
                cpes = await self._call_cpe_resolver_agent(entity)
                logging.info(f"Found {len(cpes)} CPEs for assessment {assessment_id}")

                # Get CVEs for all CPEs
                all_cves = []
                async with self.cve_service:
                    for cpe in cpes:
                        try:
                            cves = await self.cve_service.get_cves(
                                vendor=cpe.vendor, product=cpe.product, limit=100
                            )
                            all_cves.extend(cves)
                            logging.debug(
                                f"Found {len(cves)} CVEs for CPE: {cpe.vendor}:{cpe.product}"
                            )
                        except Exception as e:
                            logging.warning(
                                f"Failed to get CVEs for {cpe.vendor}:{cpe.product}: {e}"
                            )
                            continue

                # Remove duplicates based on CVE ID
                unique_cves = {cve.id: cve for cve in all_cves}.values()
                all_cves = list(unique_cves)
                logging.debug(
                    f"Total unique CVEs found for assessment {assessment_id}: {len(all_cves)}"
                )

                # Analyze CVEs with the CVE analysis agent
                if all_cves:
                    cve_analysis = await self._call_cve_analysis_agent(entity, all_cves)
                    await self.update_assessment_cve_analysis(assessment_id, cve_analysis)
                    logging.debug(f"CVE analysis completed for assessment {assessment_id}")
                else:
                    logging.debug(f"No CVEs found for assessment {assessment_id}")

            except AssessmentServiceAgentError as e:
                logging.error(f"Agent processing failed for {assessment_id}: {e}")
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

    async def _call_vendor_information_agent(self, entity: Entity) -> Vendor:
        try:
            request = VendorInformationAgentRequest(
                entity=entity,
            )
            response = await self.vendor_information_agent.execute(request)
            return response.vendor
        except AgentError as e:
            raise AssessmentServiceAgentError(f"Vendor information gathering failed: {e}") from e

    async def _call_cpe_resolver_agent(self, entity: Entity) -> list:
        try:
            request = CPEResolverAgentRequest(
                entity_data=entity,
            )
            response = await self.cpe_resolver_agent.execute(request)
            return response.cpes
        except AgentError as e:
            raise AssessmentServiceAgentError(f"CPE resolution failed: {e}") from e

    async def _call_cve_analysis_agent(self, entity: Entity, cves: list) -> dict:
        try:
            request = CVEAnalysisAgentRequest(
                entity=entity,
                cves=cves,
            )
            response = await self.cve_analysis_agent.execute(request)
            return response.model_dump()
        except AgentError as e:
            raise AssessmentServiceAgentError(f"CVE analysis failed: {e}") from e
