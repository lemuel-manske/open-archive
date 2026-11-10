const config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  clearMocks: true,
  maxWorkers: 2,

  transform: {
    "^.+\\.[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },

          transform: {
            react: { runtime: "automatic" },
          },
        },
      },
    ],
  },
};

export default config;
