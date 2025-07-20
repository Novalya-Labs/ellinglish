import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Ellinglish',
  slug: 'ellinglish',
  version: '1.0.1',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ellinglish',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    url: 'https://u.expo.dev/74012443-337d-4972-a8b8-e7efcae00afa',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    bundleIdentifier: 'com.ellinglish.app',
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffd1e9',
    },
    package: 'com.ellinglish.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-web-browser',
    'expo-apple-authentication',
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: 'com.googleusercontent.apps.285065587686-s9bebp74gpbjo1n0vsae2njt0iqrh9fa',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffd1e9',
      },
    ],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission: 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'ellinglish',
        organization: 'novalya',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCanary: true,
  },
  extra: {
    eas: {
      projectId: '74012443-337d-4972-a8b8-e7efcae00afa',
    },
  },
  owner: 'novalya',
};

export default config;
