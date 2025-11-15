from fastapi import APIRouter

from app.api.v1.endpoints import assesments, health

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(assesments.router, prefix="/assesments", tags=["assesments"])
