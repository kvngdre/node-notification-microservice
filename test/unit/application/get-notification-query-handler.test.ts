import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetNotificationQueryHandler } from "@application/notifications/queries/get-one/get-notification-query-handler";
import { GetNotificationQuery } from "@application/notifications/queries/get-one/get-notification-query";
import { NotificationExceptions } from "@domain/notification/notification-exceptions";
import { TestDataBuilder, createTestContainer, getMocks } from "../../helpers";
import { Container } from "inversify";

describe("GetNotificationQueryHandler", () => {
  let handler: GetNotificationQueryHandler;
  let container: Container;
  let mocks: ReturnType<typeof getMocks>;

  beforeEach(() => {
    container = createTestContainer();
    mocks = getMocks(container);

    handler = new GetNotificationQueryHandler(mocks.repository);
  });

  describe("handle", () => {
    it("should successfully retrieve notification by ID", async () => {
      // Arrange
      const notificationId = "test-notification-id";
      const query = new GetNotificationQuery(notificationId);
      const expectedNotification = TestDataBuilder.createEmailNotification({
        id: notificationId
      });

      vi.mocked(mocks.repository.findById).mockResolvedValue(expectedNotification);

      // Act
      const result = await handler.handle(query);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.message).toBe("Notification retrieved");
      expect(mocks.repository.findById).toHaveBeenCalledWith(notificationId);
    });

    it("should return failure when notification not found", async () => {
      // Arrange
      const notificationId = "non-existent-id";
      const query = new GetNotificationQuery(notificationId);

      vi.mocked(mocks.repository.findById).mockResolvedValue(null);

      // Act
      const result = await handler.handle(query);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.exception).toBe(NotificationExceptions.NotFound);
      expect(mocks.repository.findById).toHaveBeenCalledWith(notificationId);
    });
  });
});
