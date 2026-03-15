import { Roadmap } from '../types/roadmap';

export function parseRoadmap(raw: string): Roadmap | null {
  try {
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '');

    const parsed = JSON.parse(cleaned);

    if (!parsed.skills || !parsed.projects || !parsed.timeline) {
      throw new Error('Missing required fields');
    }

    return parsed as Roadmap;
  } catch (err) {
    console.error('Failed to parse roadmap JSON:', err);
    return null;
  }
}