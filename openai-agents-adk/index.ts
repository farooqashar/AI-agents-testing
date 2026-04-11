import { run } from '@openai/agents';
import { rootAgent } from './agent.js';

async function main() {
  console.log('Sending message to weather agent...');
  try {
    const result = await run(rootAgent, 'What is the weather like in London today?');
    console.log('\nAgent response:');
    console.log(result.finalOutput);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
