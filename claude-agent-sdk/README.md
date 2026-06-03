# Claude Agent SDK Sample

This sample demonstrates how to build a simple agent using Anthropic's official `@anthropic-ai/claude-agent-sdk`.

The agent is equipped with a custom Model Context Protocol (MCP) tool (`get_weather`) that fetches hourly temperatures using the Open-Meteo API.

## Project Structure

*   `agent.ts`: Defines the weather forecast tool using a Zod schema and packages it into an in-process MCP server.
*   `index.ts`: The main entrypoint that initializes the agent loop with `query()` and streams the thinking and responses.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript files:
   ```bash
   npm run build
   ```

3. Export your Anthropic API Key:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

## Run

Run the agent with the default prompt ("What is the weather like in London today?"):
```bash
npm start
```

Or pass a custom prompt:
```bash
node index.js "What is the temperature in Paris right now?"
```
