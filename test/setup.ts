// Test setup file
import "reflect-metadata";
import { vi, beforeEach } from "vitest";

// Global test setup
beforeEach(() => {
  // Clear all mocks between tests
  vi.clearAllMocks();

  // Reset modules to avoid cross-test contamination
  vi.resetModules();
});

// Mock environment variables for tests
process.env.NODE_ENV = "test";
process.env.DB_URI = "postgresql://test:test@localhost:5432/test_db";
process.env.PORT = "3001";
