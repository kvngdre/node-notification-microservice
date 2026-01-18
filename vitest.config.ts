/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      exclude: [
        "src/**/*.d.ts",
        "src/server.ts",
        "src/**/*.interface.ts",
        "src/**/types/**",
        "src/**/abstractions/**"
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    pool: "forks"
  },
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@application": path.resolve(__dirname, "./src/application"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@shared-kernel": path.resolve(__dirname, "./src/shared-kernel"),
      "@web": path.resolve(__dirname, "./src/web"),
      "@test": path.resolve(__dirname, "./test")
    }
  }
});
