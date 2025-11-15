import asyncio
from collections.abc import AsyncGenerator
from typing import Any

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

from app.config import settings

from ..base import LLMConnectionError, LLMProvider, LLMRateLimitError, LLMValidationError


class GeminiProvider(LLMProvider):
    def __init__(
        self,
        **kwargs: Any,
    ) -> None:
        if not settings.GEMINI_API_KEY:
            raise LLMValidationError("GEMINI_API_KEY is required")

        self._api_key = settings.GEMINI_API_KEY
        self._model_name = settings.GEMINI_MODEL

        # Configure the Gemini API
        genai.configure(api_key=self._api_key)
        self._model = genai.GenerativeModel(self._model_name)

    async def generate(
        self,
        messages: list[dict[str, str]],
        max_tokens: int | None = None,
        temperature: float | None = None,
        **kwargs: Any,
    ) -> str:
        # Set defaults
        max_tokens = max_tokens or 2048
        temperature = temperature or 0.5

        try:
            # Convert messages to Gemini format
            prompt = self._convert_messages_to_prompt(messages)

            # Configure generation parameters
            generation_config = GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )

            # Generate response using asyncio
            response = await asyncio.to_thread(
                self._model.generate_content, prompt, generation_config=generation_config
            )

            if not response.text:
                raise LLMConnectionError("Empty response from Gemini API")

            return response.text

        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "429" in error_str or "quota" in error_str:
                raise LLMRateLimitError(f"Gemini rate limit exceeded: {e}") from e
            elif (
                "validation" in error_str
                or "invalid" in error_str
                or "400" in error_str
                or "bad request" in error_str
            ):
                raise LLMValidationError(f"Gemini validation error: {e}") from e
            elif "unauthorized" in error_str or "401" in error_str or "api key" in error_str:
                raise LLMValidationError(f"Gemini authentication error: {e}") from e
            elif "connection" in error_str or "timeout" in error_str or "network" in error_str:
                raise LLMConnectionError(f"Gemini connection error: {e}") from e
            else:
                raise LLMConnectionError(f"Gemini API error: {e}") from e

    def generate_stream(
        self,
        messages: list[dict[str, str]],
        max_tokens: int | None = None,
        temperature: float | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        return self._stream_generator(messages, max_tokens, temperature, **kwargs)

    async def _stream_generator(
        self,
        messages: list[dict[str, str]],
        max_tokens: int | None = None,
        temperature: float | None = None,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        # Set defaults
        max_tokens = max_tokens or 2048
        temperature = temperature or 0.5

        try:
            # Convert messages to Gemini format
            prompt = self._convert_messages_to_prompt(messages)

            # Configure generation parameters
            generation_config = GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )

            # Generate streaming response
            response_stream = await asyncio.to_thread(
                self._model.generate_content,
                prompt,
                generation_config=generation_config,
                stream=True,
            )

            for chunk in response_stream:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "429" in error_str or "quota" in error_str:
                raise LLMRateLimitError(f"Gemini rate limit exceeded: {e}") from e
            elif (
                "validation" in error_str
                or "invalid" in error_str
                or "400" in error_str
                or "bad request" in error_str
            ):
                raise LLMValidationError(f"Gemini validation error: {e}") from e
            elif "unauthorized" in error_str or "401" in error_str or "api key" in error_str:
                raise LLMValidationError(f"Gemini authentication error: {e}") from e
            elif "connection" in error_str or "timeout" in error_str or "network" in error_str:
                raise LLMConnectionError(f"Gemini connection error: {e}") from e
            else:
                raise LLMConnectionError(f"Gemini API error: {e}") from e

    def _convert_messages_to_prompt(self, messages: list[dict[str, str]]) -> str:
        """
        Convert OpenAI-style messages to a single prompt string for Gemini.
        Gemini expects a single prompt rather than a conversation format.
        """
        prompt_parts = []

        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")

            if role == "system":
                prompt_parts.append(f"Instructions: {content}")
            elif role == "user":
                prompt_parts.append(f"User: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
            else:
                # Fallback for unknown roles
                prompt_parts.append(f"{role}: {content}")

        return "\n\n".join(prompt_parts)
