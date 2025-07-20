import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Env } from '@/constants/Env';
import { useProfileStore } from '@/features/profile/profileStore';
import { secureStorage } from '@/lib/secure-storage';
import { supabase } from '@/lib/supabase';

GoogleSignin.configure({
  webClientId: Env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: Env.GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

const USER_STORAGE_KEY = 'auth_user';
const SESSION_STORAGE_KEY = 'auth_session';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { reset: resetProfile, getProfile } = useProfileStore();

  const saveAuthState = useCallback(async (user: User | null, session: Session | null) => {
    try {
      if (user && session) {
        await secureStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        await secureStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        await secureStorage.removeItem(USER_STORAGE_KEY);
        await secureStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, []);

  const restoreAuthState = useCallback(async () => {
    try {
      const savedUser = await secureStorage.getItem(USER_STORAGE_KEY);
      const savedSession = await secureStorage.getItem(SESSION_STORAGE_KEY);

      if (savedUser && savedSession) {
        const parsedUser = JSON.parse(savedUser) as User;
        const parsedSession = JSON.parse(savedSession) as Session;

        setUser(parsedUser);
        setSession(parsedSession);
        getProfile();
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    }
  }, [getProfile]);

  useEffect(() => {
    const initializeAuth = async () => {
      await restoreAuthState();

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        await saveAuthState(null, null);
        setUser(null);
        setSession(null);
      } else {
        const currentUser = data.session?.user ?? null;
        const currentSession = data.session;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser && currentSession) {
          await saveAuthState(currentUser, currentSession);
          getProfile();
        } else {
          await saveAuthState(null, null);
        }
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;

      setSession(session);
      setUser(currentUser);

      await saveAuthState(currentUser, session);

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        getProfile();
      } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        resetProfile();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [getProfile, resetProfile, restoreAuthState, saveAuthState]);

  const value = {
    user,
    session,
    loading,
    signInWithGoogle: async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (response.type === 'success') {
          const { idToken } = response.data;
          if (idToken) {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: idToken,
            });

            if (error) {
              throw new Error('Error signing in with Google', { cause: error });
            }
          } else {
            throw new Error('No ID token present!');
          }
        }
      } catch (error) {
        console.error('Google Sign-In Error:', error);
      }
    },
    signInWithApple: async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        if (credential.identityToken) {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
          });
          if (error) {
            throw new Error('Error signing in with Apple', { cause: error });
          }
        } else {
          throw new Error('No identity token present!');
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'ERR_REQUEST_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          console.error('Apple Sign-In Error:', error);
        }
      }
    },
    signOut: async () => {
      try {
        resetProfile();
        await saveAuthState(null, null);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        if (Platform.OS !== 'web') {
          await GoogleSignin.signOut();
        }
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
