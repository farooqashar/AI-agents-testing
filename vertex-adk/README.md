# vertex-adk

A simple [Google ADK](https://google.github.io/adk-docs/get-started/typescript/) TypeScript agent that fetches weather via the [Open-Meteo](https://open-meteo.com/) API.

## Prerequisites

- **Node.js** 24.13.0 or later  
- **npm** 11.8.0 or later  

## Get started

### 1. Install dependencies

```bash
cd vertex-adk
npm install
```

### 2. Set your API key

The agent uses the **Gemini API** (model: `gemini-2.5-flash`). Create a key in [Google AI Studio](https://aistudio.google.com/app/apikey), then:

```bash
cp .env.sample .env
```

Edit `.env` and set your key:

```
GEMINI_API_KEY="your-actual-api-key"
```

## Run the agent

**CLI (interactive chat):**

```bash
npx adk run agent.ts
```

**Web UI (dev only):**

```bash
npx adk web
```

Then open http://localhost:8000, pick the agent, and ask for weather by city or coordinates (e.g. “Weather in Berlin?” or “What’s the weather at 52.52, 13.41?”).
