import { run } from '@openai/agents';
import { rootAgent } from './agent.js';

async function main() {
  const prompt = process.argv[2] || 'What is the weather like in London today?';
  console.log(`Sending prompt to weather agent: "${prompt}"`);
  try {
    const result = await run(rootAgent, prompt);
    if (!result.finalOutput) {
      console.error('The agent finished without a final output.');
      process.exitCode = 1;
      return;
    }
    console.log('\nAgent response:');
    console.log(result.finalOutput);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
