// Simple API client for the StylieAI backend
import { getSavedIdToken } from './auth';

type ChatResponse = {
  reply: string;
  explain?: string;
  tags?: string[];
  image_prompt?: string;
};

const API_BASE: string = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_BASE)
  || (typeof window !== 'undefined' && (window as any).__API_BASE__)
  || 'http://localhost:5000';

export function ensureUserId(): string {
  try {
    const existing = localStorage.getItem('stylie_user_id');
    if (existing) return existing;
    const id = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('stylie_user_id', id);
    return id;
  } catch {
    return 'user_local';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getSavedIdToken();
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json'
  };
  
  // Add auth header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge with any additional headers from options
  if (options?.headers) {
    const optHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optHeaders);
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

// Chat
export async function sendChat(userId: string, message: string): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ userId, message }),
  });
}

export async function fetchChatHistory(userId: string) {
  return request<{ chats: any[] }>(`/api/chat/${encodeURIComponent(userId)}`);
}

// Image
export async function generateOutfitImage(userId: string, prompt: string): Promise<{ url: string }> {
  return request<{ url: string }>(`/api/image`, {
    method: 'POST',
    body: JSON.stringify({ userId, prompt }),
  });
}

// Profile
export async function saveProfile(profile: any) {
  return request(`/api/profile`, {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

export type UserProfileResponse = {
  userId?: string;
  name?: string;
  age?: string | number;
  gender?: string;
  heightRange?: string;
  bodyType?: string;
  skinTone?: string;
  favouriteColours?: string[];
  region?: string;
  languagePref?: string;
  imageUrl?: string;
  error?: string;
};

export async function getProfile(userId: string): Promise<UserProfileResponse> {
  return request<UserProfileResponse>(`/api/profile/${encodeURIComponent(userId)}`);
}

// Wardrobe
export async function addWardrobeItem(userId: string, item: { name: string; category: string; imageUrl?: string }) {
  return request(`/api/wardrobe`, {
    method: 'POST',
    body: JSON.stringify({ userId, item }),
  });
}

export type WardrobeResponse = {
  items: Array<{
    id: string;
    name: string;
    category: string;
    imageUrl?: string;
  }>;
};

export async function getWardrobe(userId: string): Promise<WardrobeResponse> {
  return request<WardrobeResponse>(`/api/wardrobe/${encodeURIComponent(userId)}`);
}

export async function deleteWardrobeItem(userId: string, itemId: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/wardrobe/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  });
}

// Uploads
export async function uploadProfilePhoto(userId: string, imageBase64: string) {
  return request(`/api/upload/profile-photo`, {
    method: 'POST',
    body: JSON.stringify({ userId, imageBase64 }),
  });
}

export async function uploadWardrobeImage(userId: string, imageBase64: string) {
  return request<{ success: boolean; url: string }>(`/api/upload/wardrobe-item`, {
    method: 'POST',
    body: JSON.stringify({ userId, imageBase64 }),
  });
}


