const { withNativeWind } = require('nativewind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativeWind(getSentryExpoConfig(__dirname), { input: './global.css' });

module.exports = config;