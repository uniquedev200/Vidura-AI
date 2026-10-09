import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vidura-AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Upstash Vector
    UPSTASH_VECTOR_REST_URL: str = os.getenv("UPSTASH_VECTOR_REST_URL", "")
    UPSTASH_VECTOR_REST_TOKEN: str = os.getenv("UPSTASH_VECTOR_REST_TOKEN", "")
    
    # Groq API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # Supabase PostgreSQL Database (Optional)
    SUPABASE_DATABASE_URL: str = os.getenv("SUPABASE_DATABASE_URL", "")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
