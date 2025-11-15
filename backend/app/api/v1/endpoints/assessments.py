from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel

from app.dependencies import get_assessment_service
from app.schemas.assessment import Assessment, AssessmentInputData, AssessmentType
from app.services.assessment import AssessmentService

router = APIRouter()


class AssessmentCreateRequest(BaseModel):
    name: str
    vendor_name: str | None = None
    url: str | None = None
    assessment_type: AssessmentType = AssessmentType.MEDIUM


class AssessmentCreateResponse(BaseModel):
    assessment_id: UUID
    status: str


@router.post("", response_model=AssessmentCreateResponse)
async def create_assesment(
    request: AssessmentCreateRequest,
    background_tasks: BackgroundTasks,
    assessment_service: AssessmentService = Depends(get_assessment_service),
):
    input_data = AssessmentInputData(
        name=request.name, vendor_name=request.vendor_name, url=request.url
    )

    # Check if assessment already exists
    existing_assessment = await assessment_service.get_assessment_by_name(request.name)
    if existing_assessment:
        return AssessmentCreateResponse(
            assessment_id=existing_assessment.id, status=existing_assessment.assessment_status.value
        )

    assessment = await assessment_service.create_assessment(
        input_data=input_data, assessment_type=request.assessment_type
    )

    background_tasks.add_task(assessment_service.process_assessment, assessment.id)

    return AssessmentCreateResponse(
        assessment_id=assessment.id, status=assessment.assessment_status.value
    )


@router.get("", response_model=list[Assessment])
async def get_assessments(
    assessment_service: AssessmentService = Depends(get_assessment_service),
):
    """Get all assessments."""
    return await assessment_service.get_assessments()


@router.get("/{assesment_id}")
def get_assesment(assesment_id: int):
    return f"Details of assesment {assesment_id}"


@router.get("/{assesment_id}/status")
def get_assesment_status(assesment_id: int):
    return f"Details of assesment {assesment_id}"


@router.delete("/{assesment_id}")
def delete_assesment(assesment_id: int):
    return f"Assesment {assesment_id} deleted"


@router.put("/{assesment_id}/report")
def generate_assesment_report(assesment_id: int):
    return f"Report for assesment {assesment_id} generated"


@router.put("/{assesment_id}/report/export?format={export_format}")
def export_assesment_report(assesment_id: int, export_format: str):
    return f"Report for assesment {assesment_id} exported in {export_format} format"
