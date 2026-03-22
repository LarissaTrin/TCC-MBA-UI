import type { Config } from "jest";

const config: Config = {
  testEnvironment: "<rootDir>/jest.environment.ts",
  testEnvironmentOptions: {
    // Force Node.js export conditions so msw/node resolves the Node interceptors
    // instead of the browser ones (jest-environment-jsdom defaults to "browser").
    customExportConditions: ["node", "node-addons"],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.css$": "identity-obj-proxy",
    "\\.(png|jpg|gif|svg|woff|woff2|ttf|eot)$":
      "<rootDir>/test/__mocks__/fileMock.js",
  },
  testMatch: [
    "<rootDir>/test/**/*.test.{ts,tsx}",
    "<rootDir>/test/**/*.steps.{ts,tsx}",
  ],
  testPathIgnorePatterns: ["<rootDir>/test/e2e"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/api/**",
    "!src/auth.ts",
    "!src/middleware.ts",
  ],
};

export default config;
