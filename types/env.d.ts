declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_APP_NAME: string;
    EXPO_PUBLIC_APP_SLUG: string;
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PUBLIC_MODE: string;
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
  }
}
