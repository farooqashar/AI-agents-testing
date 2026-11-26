import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

const getWeather = tool(
  'get_weather',
  'Returns weather forecast (hourly temperatures) for a location by latitude and longitude using Open-Meteo.',
  {
    latitude: z.number().min(-90).max(90).describe('Latitude of the location (e.g. 52.52 for Berlin).'),
    longitude: z.number().min(-180).max(180).describe('Longitude of the location (e.g. 13.41 for Berlin).'),
  },
  async ({ latitude, longitude }) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto&forecast_hours=12`;
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

      if (!response.ok) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Weather API returned ${response.status} for ${latitude}, ${longitude}.`
            }
          ]
        };
      }

      const data = (await response.json()) as {
        current_weather?: { temperature: number; time: string };
        hourly?: { time: string[]; temperature_2m: number[] };
        hourly_units?: { temperature_2m: string };
        timezone_abbreviation?: string;
      };

      const reportParts: string[] = [];
      const zone = data.timezone_abbreviation ? ` ${data.timezone_abbreviation}` : '';

      if (data.current_weather) {
        const { temperature, time } = data.current_weather;
        const unit = data.hourly_units?.temperature_2m ?? '°C';
        reportParts.push(`Current weather: ${temperature}${unit} (as of ${time}${zone}).`);
      }

      if (data.hourly?.time?.length && data.hourly?.temperature_2m?.length) {
        const unit = data.hourly_units?.temperature_2m ?? '°C';
        const nextFew = data.hourly.temperature_2m.slice(0, 12).map((t, i) => `${data.hourly!.time[i]}: ${t}${unit}`).join('; ');
        reportParts.push(`Next 12 hours (local time${zone}): ${nextFew}.`);
      }

      const text = reportParts.length ? reportParts.join(' ') : 'No weather data returned.';
      return {
        content: [
          {
            type: 'text',
            text
          }
        ]
      };
    } catch (e) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to fetch weather: ${e instanceof Error ? e.message : String(e)}.`
          }
        ]
      };
    }
  }
);

export const customMcpServer = createSdkMcpServer({
  name: 'weather-service',
  version: '1.0.0',
  tools: [getWeather],
});
