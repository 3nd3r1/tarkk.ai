from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import UUID1, BaseModel

from app.dependencies import get_assessment_service
from app.schemas.assessment import AssessmentInputData, AssessmentType
from app.services.assessment import AssessmentService

router = APIRouter()


class AssessmentCreateRequest(BaseModel):
    name: str
    vendor_name: str | None = None
    url: str | None = None
    assessment_type: AssessmentType = AssessmentType.MEDIUM


class AssessmentCreateResponse(BaseModel):
    assessment_id: UUID1
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

    assessment = await assessment_service.create_assessment(
        input_data=input_data, assessment_type=request.assessment_type
    )

    background_tasks.add_task(assessment_service.process_assessment, assessment.id)

    return AssessmentCreateResponse(
        assessment_id=assessment.id, status=assessment.assessment_status.value
    )


@router.get("")
def get_assesments():
    return "List of assesments"


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
