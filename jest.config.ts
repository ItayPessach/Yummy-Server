/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testTimeout: 10000,
    testMatch: ["**/?(*.)+(spec|test).ts"]
};
