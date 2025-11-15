from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.assessment import AssessmentService


def get_assessment_service(db: Session = Depends(get_db)) -> AssessmentService:
    return AssessmentService(db=db)
