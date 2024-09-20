import { Config } from 'jest'

export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM preset
  testEnvironment: 'node', // Ensures tests run in a node-like environment
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true, // Enable ECMAScript module support
      },
    ],
  },
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'], // Treat files as ESM
} satisfies Config
