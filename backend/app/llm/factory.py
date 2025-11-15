from enum import Enum

from .base import LLMProvider
from .providers.gemini import GeminiProvider


class LLMProviderType(str, Enum):
    GEMINI = "gemini"


class LLMProviderFactory:
    """
    Factory class for creating LLM provider instances based on configuration.
    """

    @staticmethod
    def create_provider(provider: LLMProviderType, **kwargs) -> LLMProvider:
        match provider:
            case LLMProviderType.GEMINI:
                return GeminiProvider(**kwargs)
