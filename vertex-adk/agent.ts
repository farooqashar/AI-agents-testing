import { FunctionTool, LlmAgent } from '@google/adk';
import { z } from 'zod';

const getWeather = new FunctionTool({
  name: 'get_weather',
  description: 'Returns weather forecast (hourly temperatures) for a location by latitude and longitude using Open-Meteo.',
  parameters: z.object({
    // 🛡️ Sentinel: Enforce coordinate boundaries to prevent malformed API requests
    latitude: z.number().min(-90).max(90).describe('Latitude of the location (e.g. 52.52 for Berlin).'),
    longitude: z.number().min(-180).max(180).describe('Longitude of the location (e.g. 13.41 for Berlin).'),
  }),
  execute: async ({ latitude, longitude }) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`;
      // 🛡️ Sentinel: Add timeout to prevent external API from hanging indefinitely (DoS risk)
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

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

export const rootAgent = new LlmAgent({
  name: 'weather_agent',
  model: 'gemini-2.5-flash',
  description: 'Returns weather and hourly temperature forecast for a location (by latitude and longitude).',
  instruction: `You are a helpful weather assistant. Use the get_weather tool with the user's latitude and longitude to get current weather and hourly temperatures. If the user gives a city name, use approximate coordinates (e.g. Berlin 52.52, 13.41; Cape Town -33.92, 18.42; London 51.51, -0.13).`,
  tools: [getWeather],
});
