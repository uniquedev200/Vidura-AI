from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class DilemmaRequest(BaseModel):
    dilemma: str = Field(..., description="The ethical workplace, engineering, or governance dilemma description")
    role: str = Field(default="", description="User's professional role")
    counterparty: str = Field(default="", description="Opposing party or decision-maker exerting pressure")
    organizational_pressure: str = Field(default="", description="Nature and intensity of organizational pressure or mandate")
    risk_level: str = Field(default="High", description="Risk severity level")
    primary_fear: str = Field(default="", description="User's primary fear or retaliation vulnerability")
    stream: Optional[bool] = Field(default=True, description="Whether to stream the response via SSE")

class VerseCitation(BaseModel):
    id: str
    source: str
    parva: str
    sub_parva: str
    adhyaya: int
    theme: str
    text_sanskrit_translit: str
    text_english: str
    score: Optional[float] = None

class EthicsCitation(BaseModel):
    id: str
    organization: str
    clause: str
    title: str
    text: str
    score: Optional[float] = None

class RAGRetrievedContext(BaseModel):
    vidura_verses: List[Dict[str, Any]]
    ethics_clauses: List[Dict[str, Any]]
    retrieval_confidence: float

class EvaluationLogCreate(BaseModel):
    dilemma: str
    role: Optional[str] = "Senior Engineer"
    counterparty: Optional[str] = None
    organizational_pressure: Optional[str] = None
    risk_level: Optional[str] = None
    primary_fear: Optional[str] = None
    retrieved_chunks: Optional[List[Any]] = None
    generated_advice: Optional[Any] = None
    likert_rating: int = Field(..., ge=1, le=5)
    feedback_notes: Optional[str] = None
    latency_ms: Optional[int] = None
    model_used: Optional[str] = "openai/gpt-oss-120b"

class BenchmarkMetrics(BaseModel):
    total_evaluations: int
    average_likert: float
    avg_latency_ms: float
    ragas_faithfulness: float
    ragas_answer_relevance: float
    ragas_context_precision: float
    model_distribution: Dict[str, int]
