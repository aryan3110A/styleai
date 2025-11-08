export interface UserProfile {
  userId: string;
  name?: string;
  age?: string;
  gender?: string;
  heightRange?: string;
  bodyType?: string;
  skinTone?: string;
  favouriteColours?: string[];
  region?: string;
  languagePref?: string;
  imageUrl?: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
}

export interface ChatResponse {
  reply: string;
  explain: string;
  tags: string[];
  image_prompt?: string;
}


