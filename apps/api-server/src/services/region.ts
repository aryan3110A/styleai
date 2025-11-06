import { UserProfile } from '../types';

export function inferRegion(profile?: Partial<UserProfile>): string {
  return profile?.region || 'IN';
}


