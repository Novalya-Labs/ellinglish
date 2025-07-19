import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Ellinglish',
  slug: 'ellinglish',
  version: '1.0.0',
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
