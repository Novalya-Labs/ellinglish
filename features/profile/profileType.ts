import type { LocaleKey } from '@/i18n';
import type { UpdateProfileSchema } from './update-profile/updateProfile';

export type Theme = 'SYSTEM' | 'LIGHT' | 'DARK';

export type Avatar = {
  id: number;
  name: string;
  slug: string;
  url: string;
  created_at: string;
};

export type Badge = {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type Profile = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  theme: Theme;
  language: LocaleKey;
  badges: Badge[];
  expo_token: string | null;
  enabled_push: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileState = {
  profile: Profile | null;
  theme: Theme;
  language: LocaleKey;
  loading: boolean;
};

export type ProfileActions = {
  getProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfileSchema) => Promise<void>;
  getBadges: () => Promise<void>;
  getAvatars: () => Promise<Avatar[]>;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: LocaleKey) => void;
  setProfile: (profile: Profile | null) => void;
  reset: () => void;
};

export type ProfileStore = ProfileState & ProfileActions;
