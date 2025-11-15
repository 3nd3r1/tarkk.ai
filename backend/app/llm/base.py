from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
from typing import Any


class LLMProvider(ABC):
    """
    Abstract interface for LLM providers.
    """

    @abstractmethod
    def __init__(self, **kwargs: Any) -> None:
        pass

    @abstractmethod
    async def generate(
        self,
        messages: list[dict[str, str]],
        max_tokens: int | None = None,
        temperature: float | None = None,
        **kwargs: Any,
    ) -> str:
        """
        Generate text response from messages.

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            **kwargs: Additional provider-specific parameters

        Returns:
            Generated text response

        Raises:
            LLMError: If generation fails
        """
        pass

    @abstractmethod
    def generate_stream(
        self,
        messages: list[dict[str, str]],
        max_tokens: int | None = None,
        temperature: float | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming text response from messages.

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            **kwargs: Additional provider-specific parameters

        Yields:
            Chunks of generated text

        Raises:
            LLMError: If generation fails
        """
        pass


class LLMError(Exception):
    """Base exception for LLM provider errors."""


class LLMConnectionError(LLMError):
    """Raised when unable to connect to LLM service."""


class LLMRateLimitError(LLMError):
    """Raised when rate limit is exceeded."""


class LLMValidationError(LLMError):
    """Raised when request validation fails."""
