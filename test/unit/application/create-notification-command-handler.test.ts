/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateNotificationCommandHandler } from "@application/notifications/commands/create/create-notification-command-handler";
import { CreateNotificationCommandValidator } from "@application/notifications/commands/create/create-notification-command-validator";
import { TestDataBuilder, createTestContainer, getMocks } from "../../helpers";
import { Container } from "inversify";
import { Notification } from "@domain/notification/notification-entity";

describe("CreateNotificationCommandHandler", () => {
  let handler: CreateNotificationCommandHandler;
  let container: Container;
  let mocks: ReturnType<typeof getMocks>;
  let mockValidator: CreateNotificationCommandValidator;

  beforeEach(() => {
    container = createTestContainer();
    mocks = getMocks(container);

    // Mock validator
    mockValidator = {
      validate: vi.fn()
    } as any;

    handler = new CreateNotificationCommandHandler(mocks.repository, mockValidator);
  });

  describe("handle", () => {
    it("should successfully create notification with valid command", async () => {
      // Arrange
      const command = TestDataBuilder.createEmailCommand();
      const expectedNotification = TestDataBuilder.createEmailNotification();

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command as any
      });

      vi.mocked(mocks.repository.save).mockResolvedValue(expectedNotification);

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(mockValidator.validate).toHaveBeenCalledWith(command);
      expect(mocks.repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: command.channel,
          data: command.data,
          status: command.status,
          retryCount: command.retryCount
        })
      );
    });

    it("should return failure result when validation fails", async () => {
      // Arrange
      const command = TestDataBuilder.createEmailCommand();
      const validationError = new Error("Invalid email format");

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: false,
        isFailure: true,
        exception: validationError as any
      });

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.exception).toBe(validationError);
      expect(mocks.repository.save).not.toHaveBeenCalled();
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const command = TestDataBuilder.createEmailCommand();
      const dbError = new Error("Database connection failed");

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command as any
      });

      vi.mocked(mocks.repository.save).mockRejectedValue(dbError);

      // Act & Assert - The handler doesn't currently catch errors
      // so it should throw rather than return a failure result
      await expect(handler.handle(command)).rejects.toThrow("Database connection failed");
    });

    it("should create notification entity with correct properties", async () => {
      // Arrange
      const command = TestDataBuilder.createEmailCommand({
        channel: "EMAIL" as any,
        data: '{"from":"test@example.com","to":"user@example.com"}',
        retryCount: 1,
        status: "PENDING" as any
      });

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command as any
      });

      vi.mocked(mocks.repository.save).mockImplementation((notification: Notification) => {
        return Promise.resolve(notification);
      });

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mocks.repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: command.channel,
          data: command.data,
          status: command.status,
          retryCount: command.retryCount
        })
      );
    });
  });
});
