from fastapi import APIRouter
from app.api.endpoints import analyze, evaluate, history

api_router = APIRouter()
api_router.include_router(analyze.router, tags=["analyze"])
api_router.include_router(evaluate.router, tags=["evaluate"])
api_router.include_router(history.router, tags=["history"])
