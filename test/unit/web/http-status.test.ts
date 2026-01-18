import { describe, it, expect } from "vitest";
import { HttpStatus } from "@web/utils/http-status";
import { Exception, ExceptionType } from "@shared-kernel/index";

describe("HttpStatus", () => {
  describe("status codes", () => {
    it("should have correct OK status code", () => {
      expect(HttpStatus.OK).toBe(200);
    });

    it("should have correct CREATED status code", () => {
      expect(HttpStatus.CREATED).toBe(201);
    });

    it("should have correct NO_CONTENT status code", () => {
      expect(HttpStatus.NO_CONTENT).toBe(204);
    });

    it("should have correct BAD_REQUEST status code", () => {
      expect(HttpStatus.BAD_REQUEST).toBe(400);
    });

    it("should have correct UNAUTHORIZED status code", () => {
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
    });

    it("should have correct FORBIDDEN status code", () => {
      expect(HttpStatus.FORBIDDEN).toBe(403);
    });

    it("should have correct NOT_FOUND status code", () => {
      expect(HttpStatus.NOT_FOUND).toBe(404);
    });

    it("should have correct CONFLICT status code", () => {
      expect(HttpStatus.CONFLICT).toBe(409);
    });

    it("should have correct INTERNAL_SERVER_ERROR status code", () => {
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe("mapExceptionToHttpStatus", () => {
    it("should map Conflict exception to CONFLICT status", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Conflict,
        "RESOURCE_EXISTS",
        "Resource already exists"
      );

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.CONFLICT);
    });

    it("should map NotFound exception to NOT_FOUND status", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.NotFound,
        "RESOURCE_NOT_FOUND",
        "Resource not found"
      );

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should map Unauthorized exception to FORBIDDEN status", () => {
      // Arrange
      const exception = new Exception(ExceptionType.Unauthorized, "ACCESS_DENIED", "Access denied");

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should map Unauthenticated exception to UNAUTHORIZED status", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Unauthenticated,
        "INVALID_TOKEN",
        "Invalid token"
      );

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should map Validation exception to BAD_REQUEST status", () => {
      // Arrange
      const exception = new Exception(ExceptionType.Validation, "INVALID_INPUT", "Invalid input");

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should map unknown exception to INTERNAL_SERVER_ERROR status", () => {
      // Arrange
      const exception = new Exception("UNKNOWN" as ExceptionType, "UNKNOWN_ERROR", "Unknown error");

      // Act
      const status = HttpStatus.mapExceptionToHttpStatus(exception);

      // Assert
      expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
