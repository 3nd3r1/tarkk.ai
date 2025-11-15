import importlib.resources
from typing import Generic, TypeVar

import jinja2
from pydantic import BaseModel

from app.llm.base import LLMProvider

TInput = TypeVar("TInput", bound=BaseModel)
TOutput = TypeVar("TOutput", bound=BaseModel)


class BaseAgent(Generic[TInput, TOutput]):
    input_model: type[TInput]
    output_model: type[TOutput]

    def __init__(self, llm_provider: LLMProvider, max_tokens: int = 2048):
        self.llm_provider = llm_provider
        self._max_tokens = max_tokens

    async def execute(self, input_data: TInput) -> TOutput:
        """
        Execute the agent with input data and return structured output.
        """

        # Validate input type
        if not isinstance(input_data, self.input_model):
            raise AgentValidationError(
                f"Expected input of type {self.input_model.__name__}, "
                f"got {type(input_data).__name__}"
            )

        # Load agent templates
        system_template = self._load_template("prompts/system.j2")
        user_template = self._load_template("prompts/user.j2")

        # Render prompts with input data and output schema
        template_context = {
            **input_data.model_dump(),
            "output_schema": self.output_model.model_json_schema(),
        }
        system_prompt = system_template.render(**template_context)
        user_prompt = user_template.render(**template_context)

        # Prepare messages for LLM
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        response = await self.llm_provider.generate(messages, max_tokens=self._max_tokens)

        try:
            json_content = self._extract_json_from_response(response)
            return self.output_model.model_validate_json(json_content)
        except Exception as e:
            raise AgentProcessingError(
                f"Failed to parse response as {self.output_model.__name__}: {e}"
            ) from e

    def _extract_json_from_response(self, response: str) -> str:
        """
        Extract JSON content from LLM response, handling markdown code blocks.
        """
        import re

        # Remove leading/trailing whitespace
        response = response.strip()

        # Check if response is wrapped in markdown code blocks
        if "```" in response:
            # Use regex to extract content between code blocks
            # More robust pattern to handle various markdown formats
            pattern = r"```(?:json)?\s*\n?(.*?)\n?\s*```"
            match = re.search(pattern, response, re.DOTALL | re.MULTILINE)
            if match:
                extracted = match.group(1).strip()
                # Remove any leading/trailing whitespace and ensure it's valid
                return extracted

        # If no code blocks found, try to find JSON-like content
        # Look for content that starts with { and ends with }
        json_pattern = r'(\{.*\})'
        json_match = re.search(json_pattern, response, re.DOTALL)
        if json_match:
            return json_match.group(1).strip()

        # If no JSON found, return original response
        return response

    def _load_template(self, template_name: str) -> jinja2.Template:
        """Load and compile a Jinja2 template."""
        try:
            # Get the agent's module directory
            agent_module = self.__class__.__module__
            if agent_module.endswith("insight"):
                pkg = importlib.resources.files("app.agents.insight")
            else:
                agent_package = agent_module.rsplit(".", 1)[0]
                pkg = importlib.resources.files(agent_package)

            template_text = (pkg / template_name).read_text()
            return jinja2.Template(template_text)
        except (FileNotFoundError, jinja2.TemplateError) as e:
            raise AgentValidationError(f"Failed to load template {template_name}: {e}") from e


class AgentError(Exception):
    """Base exception for agent errors."""


class AgentValidationError(AgentError):
    """Raised when agent input validation fails."""


class AgentProcessingError(AgentError):
    """Raised when agent processing fails."""
