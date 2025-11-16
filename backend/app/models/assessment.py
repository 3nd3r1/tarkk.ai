from typing import Any
import uuid

from sqlalchemy import JSON, Column, DateTime, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base
from app.schemas.assessment import AssessmentStatus, AssessmentType


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)

    # Input data fields
    input_name = Column(String(255), nullable=False, index=True)
    input_vendor_name = Column(String(255), nullable=True)
    input_url = Column(Text, nullable=True)

    # Assessment metadata
    assessment_type: Mapped[AssessmentType] = mapped_column(SQLEnum(AssessmentType), nullable=False)
    assessment_status: Mapped[AssessmentStatus] = mapped_column(
        SQLEnum(AssessmentStatus), nullable=False, default=AssessmentStatus.QUEUED
    )

    # Entity data (stored as JSON when resolved)
    entity_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Vendor information data (stored as JSON when resolved)
    vendor_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # CVE analysis data (stored as JSON when analyzed)
    cve_analysis_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Trust score data (stored as JSON when calculated)
    trust_score_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
