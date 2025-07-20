import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Env } from '@/constants/Env';
import { getThemes } from './get-themes/getThemes';
import type { ThemeState, ThemeStore } from './themeTypes';

export const initialThemeState: ThemeState = {
  themes: [],
  loading: true,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...initialThemeState,

      getThemes: async () => {
        set({ loading: true });
        try {
          const themes = await getThemes();
          set({ themes, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },
    }),
    {
      name: `themes-${Env.APP_SLUG}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
