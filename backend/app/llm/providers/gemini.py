import asyncio
from collections.abc import AsyncGenerator
import logging
from typing import Any

import google.generativeai as genai
from google.generativeai.types import GenerationConfig, HarmBlockThreshold, HarmCategory

from app.config import settings

from ..base import LLMConnectionError, LLMProvider, LLMRateLimitError, LLMValidationError

logger = logging.getLogger(__name__)


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
        """Generate response with retry mechanism for safety filter blocks."""
        try:
            return await self._generate_internal(messages, max_tokens, temperature, **kwargs)
        except LLMValidationError as e:
            if "safety filters" in str(e).lower():
                # Try once more with a sanitized prompt
                sanitized_messages = self._sanitize_messages_for_safety(messages)
                return await self._generate_internal(
                    sanitized_messages, max_tokens, temperature, **kwargs
                )
            raise

    async def _generate_internal(
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

            # Configure safety settings for security research - most permissive
            safety_settings = {
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }

            response = await asyncio.to_thread(
                self._model.generate_content,
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings,
            )

            # Check if response was blocked by safety filters
            if not response.candidates:
                raise LLMValidationError("Gemini response contains no candidates")

            candidate = response.candidates[0]
            if candidate.finish_reason == 3:  # SAFETY
                raise LLMValidationError(
                    "Response blocked by Gemini safety filters - finish_reason: SAFETY"
                )
            elif candidate.finish_reason == 4:  # RECITATION
                raise LLMValidationError(
                    "Response blocked due to recitation concerns - finish_reason: RECITATION"
                )
            elif candidate.finish_reason == 5:  # OTHER
                raise LLMConnectionError(
                    "Response generation stopped for unknown reasons - finish_reason: OTHER"
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

            # Configure safety settings for security research - most permissive
            safety_settings = {
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }

            # Generate streaming response
            response_stream = await asyncio.to_thread(
                self._model.generate_content,
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings,
                stream=True,
            )

            for chunk in response_stream:
                # Check if chunk was blocked by safety filters
                if chunk.candidates:
                    candidate = chunk.candidates[0]
                    if candidate.finish_reason == 2:  # SAFETY
                        raise LLMValidationError("Response blocked by Gemini safety filters")
                    elif candidate.finish_reason == 3:  # RECITATION
                        raise LLMValidationError("Response blocked due to recitation concerns")
                    elif candidate.finish_reason == 4:  # OTHER
                        raise LLMConnectionError("Response generation stopped for unknown reasons")

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

    def _sanitize_messages_for_safety(self, messages: list[dict[str, str]]) -> list[dict[str, str]]:
        """
        Sanitize messages to avoid safety filter blocks.
        Replace potentially problematic terms with safer alternatives.
        """
        sanitized_messages = []

        # Terms that might trigger safety filters and their replacements
        replacements = {
            "vulnerability": "security concern",
            "exploit": "security issue",
            "attack": "security test",
            "malware": "suspicious software",
            "breach": "security incident",
            "hack": "security assessment",
            "penetration": "security evaluation",
        }

        for message in messages:
            content = message.get("content", "")

            # Apply replacements
            for trigger_term, replacement in replacements.items():
                content = content.replace(trigger_term, replacement)
                content = content.replace(trigger_term.title(), replacement.title())
                content = content.replace(trigger_term.upper(), replacement.upper())

            sanitized_messages.append({**message, "content": content})

        return sanitized_messages
