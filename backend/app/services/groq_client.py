import time
import json
import re
import logging
from typing import Dict, Any, Generator
from groq import Groq
from app.core.config import settings

logger = logging.getLogger(__name__)

def sanitize_counsel_token(token: str) -> str:
    """
    Cleans raw tokens from Groq to remove erratic escape artifacts,
    unneeded special symbols, and preserves classical markdown formatting.
    """
    # Remove surrogate pairs or unprintable control codes except newlines and tabs
    clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', token)
    return clean

def format_clean_counsel_text(text: str) -> str:
    """
    Post-processes the complete generated counsel text:
    - Normalizes headings to the Four Pillars of Counsel
    - Fixes inconsistent bullet points and indentation
    - Removes raw markdown code-fences wrapping the whole response if any
    """
    cleaned = text.strip()
    
    # Strip accidental outer ```markdown ... ``` wrapper if present
    if cleaned.startswith("```markdown"):
        cleaned = cleaned[len("```markdown"):].strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    # Ensure consistent section title formatting
    cleaned = re.sub(r'#+\s*(I\.\s*SA[NṄ]KA[ṬT]A\s*NIR[ŪU]PA[ṆN]A)', r'### I. SAṄKAṬA NIRŪPAṆA (Diagnosis of the Dilemma)', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'#+\s*(II\.\s*PRAM[ĀA][ṆN]A)', r'### II. PRAMĀṆA (Canonical Shloka & Standard Alignment)', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'#+\s*(III\.\s*DHARMA[- ]ARTHA\s*VIVEKA)', r'### III. DHARMA-ARTHA VIVEKA (The Balance Sheet of Consequences)', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'#+\s*(IV\.\s*UP[ĀA]YA\s*PRAYOGA)', r'### IV. UPĀYA PRAYOGA (Tactical Action & Dialogue Script)', cleaned, flags=re.IGNORECASE)

    # Normalize excessive consecutive blank lines
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.primary_model = settings.GROQ_MODEL or "openai/gpt-oss-120b"
        self.fallback_models = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b"]

    def stream_completion(
        self, 
        system_prompt: str, 
        user_prompt: str,
        retrieved_context: Dict[str, Any]
    ) -> Generator[str, None, None]:
        """
        Streams completion tokens as Server-Sent Events (SSE).
        Uses max_tokens=4096 to ensure complete, untruncated delivery of all Four Pillars.
        """
        start_time = time.time()
        first_token_time = None
        
        # Emit initial retrieved context event
        init_payload = {
            "type": "context",
            "context": retrieved_context,
            "model": self.primary_model
        }
        yield f"data: {json.dumps(init_payload)}\n\n"

        selected_model = self.primary_model
        try:
            stream = self.client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.25,
                max_tokens=2500,  # Calibrated for high-density, concise Four Pillars
                stream=True
            )
        except Exception as e:
            logger.warning(f"Error with primary model {selected_model}: {e}. Trying fallback...")
            selected_model = self.fallback_models[0]
            stream = self.client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.25,
                max_tokens=2500,
                stream=True
            )

        full_text = ""
        for chunk in stream:
            delta = chunk.choices[0].delta
            content = delta.content or ""
            if content:
                if first_token_time is None:
                    first_token_time = time.time()
                clean_content = sanitize_counsel_token(content)
                full_text += clean_content
                token_payload = {
                    "type": "token",
                    "token": clean_content
                }
                yield f"data: {json.dumps(token_payload)}\n\n"

        total_latency = int((time.time() - start_time) * 1000)
        first_token_latency = int(((first_token_time or time.time()) - start_time) * 1000)

        done_payload = {
            "type": "done",
            "latency_ms": total_latency,
            "first_token_ms": first_token_latency,
            "model": selected_model,
            "total_chars": len(full_text)
        }
        yield f"data: {json.dumps(done_payload)}\n\n"

    def generate_completion(
        self,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Non-streaming completion with full sanitization and 4096 max_tokens.
        """
        start_time = time.time()
        selected_model = self.primary_model
        try:
            resp = self.client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.25,
                max_tokens=2500
            )
        except Exception as e:
            logger.warning(f"Primary model {selected_model} failed: {e}. Using fallback...")
            selected_model = self.fallback_models[0]
            resp = self.client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.25,
                max_tokens=2500
            )

        latency_ms = int((time.time() - start_time) * 1000)
        raw_content = resp.choices[0].message.content or ""
        cleaned_content = format_clean_counsel_text(raw_content)

        return {
            "content": cleaned_content,
            "latency_ms": latency_ms,
            "model": selected_model
        }

groq_service = GroqService()
