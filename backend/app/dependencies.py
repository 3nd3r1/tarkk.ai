from fastapi import Depends
from sqlalchemy.orm import Session

from app.agents.cpe_resolver import CPEResolverAgent
from app.database import get_db
from app.llm.factory import LLMProviderFactory, LLMProviderType
from app.services.assessment import AssessmentService
from app.services.cve import CVEService


def get_assessment_service(db: Session = Depends(get_db)) -> AssessmentService:
    return AssessmentService(db=db)


def get_cve_service() -> CVEService:
    return CVEService()


def get_cpe_resolver_agent() -> CPEResolverAgent:
    llm_provider = LLMProviderFactory.create_provider(LLMProviderType.GEMINI)
    return CPEResolverAgent(llm_provider)
