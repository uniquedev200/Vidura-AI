import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from app.schemas.models import DilemmaRequest
from app.services.guardrails import validate_dilemma_request
from app.services.rag import rag_service
from app.services.groq_client import groq_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/analyze")
async def analyze_dilemma(request: DilemmaRequest):
    """
    RAG-grounded strategic counsel endpoint.
    1. Enforces Sabhā Jurisdiction & Input Completeness Guardrails.
    2. Retrieves Vidura Nīti & IEEE/ACM ethics clauses across all 6 input fields.
    3. Streams bespoke Four-Pillar counsel from Groq.
    """
    # 1. Pre-flight Guardrail & Domain Relevance Check
    validation = validate_dilemma_request(request)
    if not validation["valid"]:
        logger.warning(f"Guardrail rejected request: {validation['code']} - {validation['reason']}")
        raise HTTPException(
            status_code=422,
            detail={
                "code": validation["code"],
                "field": validation["field"],
                "reason": validation["reason"],
            }
        )

    try:
        # 2. Query Upstash Vector & Canonical Registries using all 6 fields
        context = rag_service.query_context(request.dilemma, request=request)

        # 3. Assemble augmented system & user prompts incorporating all 6 fields
        system_prompt = rag_service.assemble_system_prompt()
        user_prompt = rag_service.assemble_user_prompt(request, context)

        # 4. Stream or return full response
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

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing dilemma: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
