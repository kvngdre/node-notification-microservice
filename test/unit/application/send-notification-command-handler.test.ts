/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SendNotificationCommandHandler } from "@application/notifications/commands/send/send-notification-command-handler";
import { SendNotificationCommandValidator } from "@application/notifications/commands/send/send-notification-command-validator";
import { TestDataBuilder, createTestContainer, getMocks } from "../../helpers";
import { Container } from "inversify";

describe("SendNotificationCommandHandler", () => {
  let handler: SendNotificationCommandHandler;
  let container: Container;
  let mocks: ReturnType<typeof getMocks>;
  let mockValidator: SendNotificationCommandValidator;
  let mockPublisher: any;

  beforeEach(() => {
    container = createTestContainer();
    mocks = getMocks(container);

    // Mock validator
    mockValidator = {
      validate: vi.fn()
    } as any;

    // Mock publisher
    mockPublisher = {
      publish: vi.fn()
    };

    handler = new SendNotificationCommandHandler(mocks.repository, mockValidator, mockPublisher);
  });

  describe("handle", () => {
    it("should successfully send email notification", async () => {
      // Arrange
      const command = TestDataBuilder.createSendEmailCommand();

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command
      });

      vi.mocked(mocks.repository.save).mockResolvedValue(TestDataBuilder.createEmailNotification());
      vi.mocked(mockPublisher.publish).mockResolvedValue(undefined);

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe("Notification sent successfully");
      expect(typeof result.value).toBe("string"); // The ID should be a string
      expect(result.value).toBeTruthy(); // Should have a value
      expect(mockValidator.validate).toHaveBeenCalledWith(command);
      expect(mocks.repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: command.channel,
          data: JSON.stringify(command.data)
        })
      );
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: command.channel
        })
      );
    });

    it("should return failure when validation fails", async () => {
      // Arrange
      const command = TestDataBuilder.createSendEmailCommand();
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
      expect(mockPublisher.publish).not.toHaveBeenCalled();
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const command = TestDataBuilder.createSendEmailCommand();
      const dbError = new Error("Database connection failed");

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command as any
      });

      vi.mocked(mocks.repository.save).mockRejectedValue(dbError);

      // Act & Assert
      await expect(handler.handle(command)).rejects.toThrow("Database connection failed");
    });

    it("should handle publisher errors gracefully", async () => {
      // Arrange
      const command = TestDataBuilder.createSendEmailCommand();
      const savedNotification = TestDataBuilder.createEmailNotification();
      const publishError = new Error("Message queue connection failed");

      vi.mocked(mockValidator.validate).mockReturnValue({
        isSuccess: true,
        isFailure: false,
        value: command as any
      });

      vi.mocked(mocks.repository.save).mockResolvedValue(savedNotification);
      vi.mocked(mockPublisher.publish).mockRejectedValue(publishError);

      // Act & Assert
      await expect(handler.handle(command)).rejects.toThrow("Message queue connection failed");
    });
  });
});
