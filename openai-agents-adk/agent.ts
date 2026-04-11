import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

const getWeather = tool({
  name: 'get_weather',
  description: 'Returns weather forecast (hourly temperatures) for a location by latitude and longitude using Open-Meteo.',
  parameters: z.object({
    latitude: z.number().describe('Latitude of the location (e.g. 52.52 for Berlin).'),
    longitude: z.number().describe('Longitude of the location (e.g. 13.41 for Berlin).'),
  }),
  execute: async ({ latitude, longitude }) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`;
      const response = await fetch(url);

      if (!response.ok) {
        return { status: 'error', report: `Weather API returned ${response.status} for ${latitude}, ${longitude}.` };
      }

      const data = (await response.json()) as {
        current_weather?: { temperature: number; time: string };
        hourly?: { time: string[]; temperature_2m: number[] };
        hourly_units?: { temperature_2m: string };
      };

      const reportParts: string[] = [];

      if (data.current_weather) {
        const { temperature, time } = data.current_weather;
        const unit = data.hourly_units?.temperature_2m ?? '°C';
        reportParts.push(`Current weather: ${temperature}${unit} (as of ${time}).`);
      }

      if (data.hourly?.time?.length && data.hourly?.temperature_2m?.length) {
        const unit = data.hourly_units?.temperature_2m ?? '°C';
        const nextFew = data.hourly.temperature_2m.slice(0, 12).map((t, i) => `${data.hourly!.time[i]}: ${t}${unit}`).join('; ');
        reportParts.push(`Next 12 hours: ${nextFew}.`);
      }

      return {
        status: 'success',
        report: reportParts.length ? reportParts.join(' ') : 'No weather data returned.',
      };
    } catch (e) {
      return {
        status: 'error',
        report: `Failed to fetch weather: ${e instanceof Error ? e.message : String(e)}.`,
      };
    }
  },
});

export const rootAgent = new Agent({
  name: 'weather_agent',
  model: 'gpt-4o',
  instructions: `You are a helpful weather assistant. Use the get_weather tool with the user's latitude and longitude to get current weather and hourly temperatures. If the user gives a city name, use approximate coordinates (e.g. Berlin 52.52, 13.41; Cape Town -33.92, 18.42; London 51.51, -0.13).`,
  tools: [getWeather],
});
