from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tarkk.ai"
    PROJECT_DESCRIPTION: str = "TarkAI is an AI-powered CISO analysis tool"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-1.5-pro"

    class ConfigDict:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
