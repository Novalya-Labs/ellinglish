import type { LocaleKey } from '@/i18n';

export type Theme = 'SYSTEM' | 'LIGHT' | 'DARK';

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  language: LocaleKey;
  theme: Theme;
  updated_at: string;
  created_at: string;
};

export interface ProfileState {
  profile: Profile | null;
  language: LocaleKey;
  theme: Theme;
}

export type ProfileStore = ProfileState & {
  setProfile: (profile: Profile) => void;
  setTheme: (theme: Theme) => void;
  reset: () => void;
};
