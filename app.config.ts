import type { ExpoConfig } from 'expo/config';

// Placeholders until the owner chooses the final name and IDs (CLAUDE.md section 1).
// The Android package / iOS bundle ID cannot be changed after the first store upload.
const APP_NAME = 'APP_NAME';
const APP_SLUG = 'app-name';
const APP_SCHEME = 'appname';

const config: ExpoConfig = {
  name: APP_NAME,
  slug: APP_SLUG,
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: APP_SCHEME,
  userInterfaceStyle: 'automatic',
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
