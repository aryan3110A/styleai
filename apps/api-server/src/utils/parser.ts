export function tryParseJsonFromMarkdown(text: string) {
  try {
    const match = text.match(/```json([\s\S]*?)```/);
    const fenced = match ? match[1].trim() : undefined;
    const jsonString = fenced ?? text;
    return JSON.parse(jsonString);
  } catch {
    return { reply: text, explain: 'Unable to parse JSON', tags: [] };
  }
}


