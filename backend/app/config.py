from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "TarkAI - AI CISO analysis"
    PROJECT_DESCRIPTION: str = "TarkAI is an AI-powered CISO analysis tool"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    class ConfigDict:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
