import { describe, it, expect } from "vitest";
import { Result } from "@shared-kernel/result";
import { Exception, ValidationException, ExceptionType } from "@shared-kernel/index";

describe("Result", () => {
  describe("success", () => {
    it("should create successful result with message and value", () => {
      // Arrange & Act
      const result = Result.success("Operation successful", { id: 1, name: "test" });

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.message).toBe("Operation successful");
      expect(result.value).toEqual({ id: 1, name: "test" });
    });

    it("should create successful result with only message", () => {
      // Arrange & Act
      const result = Result.success("Operation successful");

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.message).toBe("Operation successful");
      expect(result.value).toBeUndefined();
    });
  });

  describe("failure", () => {
    it("should create failure result with exception", () => {
      // Arrange
      const exception = Exception.NotFound("Test.NotFound", "Test not found");

      // Act
      const result = Result.failure(exception);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.exception).toBe(exception);
    });
  });

  describe("property access", () => {
    it("should throw error when accessing message on failure result", () => {
      // Arrange
      const exception = Exception.NotFound("Test.NotFound", "Test not found");
      const result = Result.failure(exception);

      // Act & Assert
      expect(() => result.message).toThrow("Cannot get message of a failure result");
    });

    it("should throw error when accessing value on failure result", () => {
      // Arrange
      const exception = Exception.NotFound("Test.NotFound", "Test not found");
      const result = Result.failure(exception);

      // Act & Assert
      expect(() => result.value).toThrow("Cannot get data of a failure result");
    });

    it("should throw error when accessing exception on success result", () => {
      // Arrange
      const result = Result.success("Success", "data");

      // Act & Assert
      expect(() => result.exception).toThrow("Cannot get exception of a success result");
    });
  });
});

describe("Exception", () => {
  it("should create exception with correct properties", () => {
    // Act
    const exception = new Exception(ExceptionType.Validation, "TEST001", "Test validation failed");

    // Assert
    expect(exception.exceptionType).toBe("validation");
    expect(exception.code).toBe("TEST001");
    expect(exception.description).toBe("Test validation failed");
  });

  describe("static factory methods", () => {
    it("should create Conflict exception", () => {
      // Act
      const exception = Exception.Conflict("TEST001", "Resource already exists");

      // Assert
      expect(exception.exceptionType).toBe("conflict");
      expect(exception.code).toBe("TEST001");
      expect(exception.description).toBe("Resource already exists");
    });

    it("should create Failure exception", () => {
      // Act
      const exception = Exception.Failure("TEST002", "Operation failed");

      // Assert
      expect(exception.exceptionType).toBe("failure");
      expect(exception.code).toBe("TEST002");
      expect(exception.description).toBe("Operation failed");
    });

    it("should create NotFound exception", () => {
      // Act
      const exception = Exception.NotFound("TEST003", "Resource not found");

      // Assert
      expect(exception.exceptionType).toBe("not found");
      expect(exception.code).toBe("TEST003");
      expect(exception.description).toBe("Resource not found");
    });

    it("should create Unauthenticated exception", () => {
      // Act
      const exception = Exception.Unauthenticated("TEST004", "User not authenticated");

      // Assert
      expect(exception.exceptionType).toBe("unauthenticated");
      expect(exception.code).toBe("TEST004");
      expect(exception.description).toBe("User not authenticated");
    });

    it("should create Unauthorized exception", () => {
      // Act
      const exception = Exception.Unauthorized("TEST005", "User not authorized");

      // Assert
      expect(exception.exceptionType).toBe("unauthorized");
      expect(exception.code).toBe("TEST005");
      expect(exception.description).toBe("User not authorized");
    });

    it("should create Unexpected exception", () => {
      // Act
      const exception = Exception.Unexpected;

      // Assert
      expect(exception.exceptionType).toBe("unexpected");
      expect(exception.code).toBe("General.Unexpected");
      expect(exception.description).toBe("Something went wrong");
    });
  });
});

describe("ValidationException", () => {
  it("should create validation exception with path", () => {
    // Act
    const exception = new ValidationException("Validation.Required", "Field is required", [
      "user",
      "email"
    ]);

    // Assert
    expect(exception.exceptionType).toBe("validation");
    expect(exception.code).toBe("Validation.Required");
    expect(exception.description).toBe("Field is required");
    expect(exception.path).toEqual(["user", "email"]);
  });
});
