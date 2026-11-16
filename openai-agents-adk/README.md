# OpenAI Agents SDK Sample

This sample demonstrates how to build a simple agent using OpenAI's `@openai/agents` SDK.

The agent is equipped with a custom tool (`get_weather`) that fetches current weather and hourly temperatures using the Open-Meteo API, and is powered by `gpt-4o`.

## Project Structure

*   `agent.ts`: Defines the weather forecast tool using a Zod schema and the `weather_agent` that uses it.
*   `index.ts`: The main entrypoint that runs the agent with `run()` and prints its final output.

## Setup

Requires Node.js 20.6 or later (for `--env-file`).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript files (output goes to `dist/`):
   ```bash
   npm run build
   ```

3. Copy `.env.sample` to `.env` and fill in your OpenAI API Key:
   ```bash
   cp .env.sample .env
   ```

## Run

Run the agent with the prompt "What is the weather like in London today?":
```bash
npm start
```

`npm start` loads `OPENAI_API_KEY` from `.env`, so no manual `export` is needed.
