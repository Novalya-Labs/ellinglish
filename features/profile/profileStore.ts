import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Env } from '@/constants/Env';
import { getBadges } from './get-badges/getBadges';
import { getProfile } from './get-profile/getProfile';
import type { ProfileState, ProfileStore } from './profileType';
import { updateProfile } from './update-profile/updateProfile';

export const initialProfileState: ProfileState = {
  profile: null,
  loading: true,
  theme: 'SYSTEM',
  language: 'EN',
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      ...initialProfileState,

      getProfile: async () => {
        set({ loading: true });
        const profile = await getProfile();
        set({ profile, loading: false });
      },

      updateProfile: async (payload) => {
        const updatedProfileData = await updateProfile(payload);
        const currentProfile = get().profile;

        set({
          profile: {
            ...currentProfile,
            ...updatedProfileData,
            badges: currentProfile?.badges || [],
          },
        });
      },

      getBadges: async () => {
        const badges = await getBadges();
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              badges,
            },
          });
        }
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setLanguage: (language) => {
        set({ language });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      reset: () => {
        set({ profile: null });
      },
    }),
    {
      name: `profile-${Env.APP_SLUG}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
      }),
    },
  ),
);
