import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from app.schemas.models import DilemmaRequest
from app.services.rag import rag_service
from app.services.groq_client import groq_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/analyze")
async def analyze_dilemma(request: DilemmaRequest):
    """
    RAG-grounded strategic counsel endpoint.
    Retrieves Vidura Nīti & IEEE/ACM ethics clauses, then streams
    sub-500ms counsel from Groq.
    """
    try:
        # 1. Query Upstash Vector for grounded Dharmic & Ethics context
        context = rag_service.query_context(request.dilemma)
        
        # 2. Assemble augmented system & user prompts
        system_prompt = rag_service.assemble_system_prompt()
        user_prompt = rag_service.assemble_user_prompt(request, context)

        # 3. Stream or return full response
        if request.stream:
            return StreamingResponse(
                groq_service.stream_completion(system_prompt, user_prompt, context),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no"
                }
            )
        else:
            result = groq_service.generate_completion(system_prompt, user_prompt)
            return JSONResponse(content={
                "advice": result["content"],
                "context": context,
                "latency_ms": result["latency_ms"],
                "model": result["model"]
            })

    except Exception as e:
        logger.error(f"Error analyzing dilemma: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
