import Constants from 'expo-constants';

export const Env = {
  ...Constants.expoConfig?.extra,
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME,
  APP_SLUG: process.env.EXPO_PUBLIC_APP_SLUG,
  MODE: process.env.EXPO_PUBLIC_MODE || 'development',
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
} as const;
