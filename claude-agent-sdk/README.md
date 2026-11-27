# Claude Agent SDK Sample

This sample demonstrates how to build a simple agent using Anthropic's official `@anthropic-ai/claude-agent-sdk`.

The agent is equipped with a custom Model Context Protocol (MCP) tool (`get_weather`) that fetches hourly temperatures using the Open-Meteo API.

## Project Structure

*   `agent.ts`: Defines the weather forecast tool using a Zod schema and packages it into an in-process MCP server.
*   `index.ts`: The main entrypoint that initializes the agent loop with `query()` and streams the thinking and responses.

## Setup

Requires Node.js 22.9 or later (for `--env-file-if-exists`).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript files (output goes to `dist/`):
   ```bash
   npm run build
   ```

3. Copy `.env.sample` to `.env` and fill in your Anthropic API Key:
   ```bash
   cp .env.sample .env
   ```

   `npm start` loads `ANTHROPIC_API_KEY` from `.env` when the file exists. Without a `.env`, export the key instead:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

## Run

Run the agent with the default prompt ("What is the weather like in Long Island today?"):
```bash
npm start
```

Or pass a custom prompt:
```bash
npm start -- "What is the temperature in Paris right now?"
```
