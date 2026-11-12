import baseConfig from '@lemuel-manske/config-jest';

const config = {
  ...baseConfig,

  transformIgnorePatterns: ['/node_modules/(?!@lemuel-manske/config-jest/)'],
};

export default config;
