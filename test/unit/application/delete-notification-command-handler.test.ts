import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteNotificationCommandHandler } from "@application/notifications/commands/delete/delete-notification-command-handler";
import { DeleteNotificationCommand } from "@application/notifications/commands/delete/delete-notification-command";
import { NotificationExceptions } from "@domain/notification/notification-exceptions";
import { TestDataBuilder, createTestContainer, getMocks } from "../../helpers";
import { Container } from "inversify";

describe("DeleteNotificationCommandHandler", () => {
  let handler: DeleteNotificationCommandHandler;
  let container: Container;
  let mocks: ReturnType<typeof getMocks>;

  beforeEach(() => {
    container = createTestContainer();
    mocks = getMocks(container);

    handler = new DeleteNotificationCommandHandler(mocks.repository);
  });

  describe("handle", () => {
    it("should successfully delete notification", async () => {
      // Arrange
      const notificationId = "test-notification-id";
      const command = new DeleteNotificationCommand(notificationId);
      const notification = TestDataBuilder.createEmailNotification({
        id: notificationId
      });

      vi.mocked(mocks.repository.findById).mockResolvedValue(notification);
      vi.mocked(mocks.repository.remove).mockResolvedValue(notification);

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe("Notification deleted");
      expect(mocks.repository.findById).toHaveBeenCalledWith(notificationId);
      expect(mocks.repository.remove).toHaveBeenCalledWith(notification);
    });

    it("should return failure when notification not found", async () => {
      // Arrange
      const notificationId = "non-existent-id";
      const command = new DeleteNotificationCommand(notificationId);

      vi.mocked(mocks.repository.findById).mockResolvedValue(null);

      // Act
      const result = await handler.handle(command);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.exception).toBe(NotificationExceptions.NotFound);
      expect(mocks.repository.findById).toHaveBeenCalledWith(notificationId);
      expect(mocks.repository.remove).not.toHaveBeenCalled();
    });
  });
});
