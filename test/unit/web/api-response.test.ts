/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { ApiResponse } from "@web/utils/api-response";
import { HttpStatus } from "@web/utils/http-status";
import { Exception, ExceptionType } from "@shared-kernel/index";
import { Response } from "express";

describe("ApiResponse", () => {
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      setHeader: vi.fn()
    } as any;
  });

  describe("success", () => {
    it("should create success response with data and default status", () => {
      // Arrange
      const message = "Success";
      const data = { id: 1, name: "Test" };

      // Act
      const response = ApiResponse.success(message, data);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.message).toBe(message);
      expect(response.data).toEqual(data);
      expect(response.error).toBeUndefined();
    });

    it("should create success response with custom status", () => {
      // Arrange
      const message = "Created";
      const data = { id: 1 };
      const status = HttpStatus.CREATED;

      // Act
      const response = ApiResponse.success(message, data, status);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(201);
      expect(response.message).toBe(message);
      expect(response.data).toEqual(data);
      expect(response.error).toBeUndefined();
    });

    it("should create success response with undefined data", () => {
      // Arrange
      const message = "No Content";

      // Act
      const response = ApiResponse.success(message, undefined, HttpStatus.NO_CONTENT);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(204);
      expect(response.message).toBe(message);
      expect(response.data).toBeUndefined();
      expect(response.error).toBeUndefined();
    });
  });

  describe("failure", () => {
    it("should create failure response for validation exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Validation,
        "INVALID_INPUT",
        "Input validation failed"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(400);
      expect(response.message).toBeUndefined();
      expect(response.data).toBeUndefined();
      expect(response.error).toEqual({
        errorType: ExceptionType.Validation,
        code: "INVALID_INPUT",
        description: "Input validation failed",
        path: undefined
      });
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/problem+json"
      );
    });

    it("should create failure response for not found exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.NotFound,
        "RESOURCE_NOT_FOUND",
        "The requested resource was not found"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(404);
      expect(response.error).toEqual({
        errorType: ExceptionType.NotFound,
        code: "RESOURCE_NOT_FOUND",
        description: "The requested resource was not found",
        path: undefined
      });
    });

    it("should create failure response for conflict exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Conflict,
        "RESOURCE_CONFLICT",
        "Resource already exists"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(409);
      expect(response.error).toEqual({
        errorType: ExceptionType.Conflict,
        code: "RESOURCE_CONFLICT",
        description: "Resource already exists",
        path: undefined
      });
    });

    it("should create failure response for unauthorized exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Unauthorized,
        "ACCESS_DENIED",
        "Access denied to resource"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(403);
      expect(response.error).toEqual({
        errorType: ExceptionType.Unauthorized,
        code: "ACCESS_DENIED",
        description: "Access denied to resource",
        path: undefined
      });
    });

    it("should create failure response for unauthenticated exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Unauthenticated,
        "INVALID_TOKEN",
        "Invalid authentication token"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(401);
      expect(response.error).toEqual({
        errorType: ExceptionType.Unauthenticated,
        code: "INVALID_TOKEN",
        description: "Invalid authentication token",
        path: undefined
      });
    });

    it("should create failure response with internal server error for unknown exception", () => {
      // Arrange
      const exception = new Exception(
        "UNKNOWN" as ExceptionType,
        "UNKNOWN_ERROR",
        "An unknown error occurred"
      );

      // Act
      const response = ApiResponse.failure(exception, mockResponse);

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBe(500);
      expect(response.error).toEqual({
        errorType: "UNKNOWN",
        code: "UNKNOWN_ERROR",
        description: "An unknown error occurred",
        path: undefined
      });
    });

    it("should include path when provided in exception", () => {
      // Arrange
      const exception = new Exception(
        ExceptionType.Validation,
        "FIELD_INVALID",
        "Field is invalid"
      );
      const exceptionWithPath = { ...exception, path: ["data", "email"] };

      // Act
      const response = ApiResponse.failure(exceptionWithPath, mockResponse);

      // Assert
      expect(response.error).toEqual({
        errorType: ExceptionType.Validation,
        code: "FIELD_INVALID",
        description: "Field is invalid",
        path: ["data", "email"]
      });
    });
  });
});
