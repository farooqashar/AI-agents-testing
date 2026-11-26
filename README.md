# AI Agents Testing

A collection of sample AI agents for exploring different frameworks and APIs.

## Samples

| Sample | Framework | Description |
|--------|-----------|-------------|
| [`vertex-adk`](vertex-adk/) | [Google ADK](https://google.github.io/adk-docs/get-started/typescript/) | Weather agent using the Open-Meteo API, powered by Gemini |
| [`openai-agents-adk`](openai-agents-adk/) | [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) | Weather agent using the Open-Meteo API, powered by an OpenAI model |
| [`claude-agent-sdk`](claude-agent-sdk/) | [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript) | Weather agent using the Open-Meteo API, powered by Claude |

## Getting Started

Each sample has its own `README.md` with setup and run instructions. Pick a sample from the table above and follow its guide.

## Prerequisites

Requirements vary by sample. Common tools you may need:

- **Node.js** (for TypeScript-based samples)
- An API key for the sample's LLM provider:
  - `GEMINI_API_KEY` for `vertex-adk`
  - `OPENAI_API_KEY` for `openai-agents-adk`
  - `ANTHROPIC_API_KEY` for `claude-agent-sdk`

  Each sample's `.env.sample` shows the variable it reads.

Refer to each sample's `README.md` for exact version requirements.
