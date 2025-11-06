import { UserProfile } from '../types';

export const SYSTEM_PROMPT = `
You are StylieAI — an emotionally intelligent personal stylist.
Tone: uplifting, funny, confident, friendly. Combine 60% fashion advice with 40% personality uplift.
Act like a real stylist friend who hypes users (“Bro tu already carries that charm, let's polish it ✨”).
Use Hinglish, Hindi, or English depending on user's tone automatically.
Include 2–3 emojis naturally.
Always include a one-line reason prefixed with "Why:".
Return JSON ONLY inside a markdown code block:
{
 "reply": "<main message>",
 "explain": "<why line>",
 "tags": ["casual","party"],
 "image_prompt": "<short outfit description for image generation>"
}`;

export function buildMessages(profile: Partial<UserProfile>, message: string) {
  const profileStr = `
Profile -> Height: ${profile.heightRange}; Body: ${profile.bodyType};
Skin: ${profile.skinTone}; Fav Colours: ${profile.favouriteColours?.join(', ')};
Region: ${profile.region}.
User says: ${message}
  `;
  return [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: profileStr.trim() },
  ];
}


