import { reactConfig } from '@lemuel-manske/config-vite';

import { mergeConfig } from 'vite';

const CAPTURES_ENDPOINT = '/captures';
const HEALTH_ENDPOINT = '/health';
const LOGIN_ENDPOINT = '/login-sessions';
const PROFILES_ENDPOINT = '/profiles';

const BACKEND_URL = 'http://localhost:8000';

const config = mergeConfig(reactConfig, {
  server: {
    proxy: {
      [CAPTURES_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
      [HEALTH_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
      [LOGIN_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
      [PROFILES_ENDPOINT]: { target: BACKEND_URL, changeOrigin: true },
    },
  },
});

export default config;
