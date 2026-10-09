from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class DilemmaRequest(BaseModel):
    dilemma: str = Field(..., description="The ethical workplace or algorithmic dilemma description")
    role: str = Field(default="Senior Software Engineer", description="User's professional role")
    counterparty: Optional[str] = Field(default="VP of Product / Executive Leadership", description="Opposing party or manager exerting pressure")
    organizational_pressure: str = Field(default="Critical Deadline & Revenue Threat", description="Nature and intensity of organizational pressure")
    risk_level: str = Field(default="High (Career & Systemic Harm)", description="Risk severity level")
    primary_fear: Optional[str] = Field(default="Retaliation & Career Blacklisting", description="User's primary fear or vulnerability")
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
    organization: str # "ACM" or "IEEE"
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
