import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Env } from '@/constants/Env';
import { defaultLanguage } from '@/i18n/locales';
import type { ProfileState, ProfileStore } from './profileType';

const initialProfileState: ProfileState = {
  profile: null,
  language: defaultLanguage,
  theme: 'SYSTEM',
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      ...initialProfileState,

      setProfile: (profile) => {
        set({ profile, language: profile.language });
      },

      setTheme(theme) {
        set({ theme });
      },

      reset: () => {
        set({ profile: null, theme: 'SYSTEM' });
      },
    }),
    {
      name: `profile-${Env.APP_SLUG}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        language: state.language,
        theme: state.theme,
      }),
    },
  ),
);
