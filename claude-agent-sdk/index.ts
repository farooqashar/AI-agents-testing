import { query } from '@anthropic-ai/claude-agent-sdk';
import { customMcpServer } from './agent.js';

async function main() {
  const prompt = process.argv[2] || 'What is the weather like in London today?';
  console.log(`Sending prompt to Claude Agent: "${prompt}"\n`);

  try {
    const stream = query({
      prompt,
      options: {
        mcpServers: {
          weather: customMcpServer,
        },
        // We can restrict allowedTools to only use our custom MCP tools,
        // or let it use default system tools if needed. Here, we register our custom server.
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
        console.log(`\n\nTask finished with status: ${message.subtype}`);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
