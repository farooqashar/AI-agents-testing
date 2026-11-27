import { query } from '@anthropic-ai/claude-agent-sdk';
import { customMcpServer } from './agent.js';

async function main() {
  const prompt = process.argv[2] || 'What is the weather like in Long Island today?';
  console.log(`Sending prompt to Claude Agent: "${prompt}"\n`);

  try {
    const stream = query({
      prompt,
      options: {
        mcpServers: {
          weather: customMcpServer,
        },
        // Disable all built-in tools (Bash, Write, Edit, WebFetch, ...) so only
        // the weather MCP tool is available, pre-approve it, and deny anything
        // else without prompting so the demo stays non-interactive.
        tools: [],
        allowedTools: ['mcp__weather__get_weather'],
        permissionMode: 'dontAsk',
      },
    });

    for await (const message of stream) {
      if (message.type === 'assistant') {
        for (const block of message.message.content) {
          if (block.type === 'text') {
            process.stdout.write(block.text);
          } else if (block.type === 'tool_use') {
            console.log(`\n\n[Agent invoking tool: "${block.name}" with arguments: ${JSON.stringify(block.input)}]`);
          }
        }
      } else if (message.type === 'result') {
        if (message.subtype !== 'success') {
          console.error(`\n\nTask failed with status: ${message.subtype}`);
          for (const err of message.errors) {
            console.error(err);
          }
          process.exitCode = 1;
        } else if (message.is_error) {
          console.error(`\n\nTask finished with status: ${message.subtype}, but reported an error:`);
          console.error(message.result);
          process.exitCode = 1;
        } else {
          console.log(`\n\nTask finished with status: ${message.subtype}`);
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
