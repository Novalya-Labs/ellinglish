import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Env } from '@/constants/Env';
import { useProfileStore } from '@/features/profile/profileStore';
import { supabase } from '@/lib/supabase';

GoogleSignin.configure({
  webClientId: Env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: Env.GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

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

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        getProfile();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [getProfile]);

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
