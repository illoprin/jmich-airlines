module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
	testMatch: ["<rootDir>/src/test/**/*.test.ts"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverage: true,
  coverageReporters: ["text-summary", "html"],
	collectCoverageFrom: [
		"/src/**/*.ts",
		"!/src/types/*.ts",
		"!/src/middleware/*.ts",
		"!/src/config/*.ts",
		"!/src/test/**",
		"!/node_modules/**",
		"!/dist/**",
	],
	collectCoverageFrom: ["src/**/*.ts", "!src/test/**/*.{ts,js}", "!src/**/*.d.ts", "!src/index.ts"],
};
