import OpenAI from 'openai';

export const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callChat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<string> {
  const res = await client.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
    temperature: 0.9,
    max_tokens: 400,
  });
  return res.choices[0]?.message?.content ?? '';
}

export async function generateImage(prompt: string): Promise<string> {
  const res = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024',
  });
  const data = res.data;
  if (!data || data.length === 0 || !data[0]?.url) {
    throw new Error('OpenAI image generation returned no data');
  }
  return data[0].url;
}


