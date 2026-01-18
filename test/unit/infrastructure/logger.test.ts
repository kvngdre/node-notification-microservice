import { describe, it, expect, beforeEach, vi } from "vitest";
import { Logger } from "@infrastructure/logging/logger";

// Mock winston and its dependencies completely
vi.mock("winston", () => {
  const mockWinstonLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    http: vi.fn(),
    debug: vi.fn()
  };

  return {
    default: {
      createLogger: vi.fn(() => mockWinstonLogger),
      transports: {
        Console: vi.fn(),
        DailyRotateFile: vi.fn()
      },
      format: {
        combine: vi.fn(() => ({})),
        colorize: vi.fn(() => ({})),
        splat: vi.fn(() => ({})),
        printf: vi.fn(() => ({})),
        align: vi.fn(() => ({})),
        timestamp: vi.fn(() => ({}))
      },
      addColors: vi.fn()
    },
    createLogger: vi.fn(() => mockWinstonLogger),
    transports: {
      Console: vi.fn(),
      DailyRotateFile: vi.fn()
    },
    format: {
      combine: vi.fn(() => ({})),
      colorize: vi.fn(() => ({})),
      splat: vi.fn(() => ({})),
      printf: vi.fn(() => ({})),
      align: vi.fn(() => ({})),
      timestamp: vi.fn(() => ({}))
    },
    addColors: vi.fn()
  };
});

vi.mock("winston-daily-rotate-file", () => ({}));

vi.mock("@shared-kernel/environment", () => ({
  Environment: {
    isDevelopment: true
  }
}));

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  describe("logging methods", () => {
    it("should have logError method", () => {
      expect(typeof logger.logError).toBe("function");
    });

    it("should have logWarn method", () => {
      expect(typeof logger.logWarn).toBe("function");
    });

    it("should have logInfo method", () => {
      expect(typeof logger.logInfo).toBe("function");
    });

    it("should have logHttp method", () => {
      expect(typeof logger.logHttp).toBe("function");
    });

    it("should have logDebug method", () => {
      expect(typeof logger.logDebug).toBe("function");
    });

    it("should call methods without throwing errors", () => {
      expect(() => logger.logError("test")).not.toThrow();
      expect(() => logger.logWarn("test")).not.toThrow();
      expect(() => logger.logInfo("test")).not.toThrow();
      expect(() => logger.logHttp("test")).not.toThrow();
      expect(() => logger.logDebug("test")).not.toThrow();
    });
  });
});
