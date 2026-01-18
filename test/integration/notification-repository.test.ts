/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Repository } from "typeorm";
import { Notification } from "@domain/notification/notification-entity";
import { NotificationRepository } from "@infrastructure/repositories/notification-repository";
import { DatabaseTestHelper, TestDataBuilder } from "../helpers/index";
import { NotificationStatus, NotificationChannel } from "@domain/notification/types";
import DatabaseContext from "@infrastructure/database/database-context";

describe("NotificationRepository Integration", () => {
  let repository: Repository<Notification>;
  let notificationRepository: NotificationRepository;
  let mockDbContext: DatabaseContext;

  beforeAll(async () => {
    await DatabaseTestHelper.setupTestDatabase();
    repository = DatabaseTestHelper.getRepository(
      Notification as new () => Notification
    ) as Repository<Notification>;

    // Create a mock DatabaseContext that uses our test repository
    mockDbContext = {
      notifications: repository
    } as any;

    notificationRepository = new NotificationRepository(mockDbContext);
  }, 60000); // Increase timeout to 60 seconds

  afterAll(async () => {
    await DatabaseTestHelper.teardownTestDatabase();
  }, 30000); // Increase teardown timeout

  beforeEach(async () => {
    await DatabaseTestHelper.clearDatabase();
  });

  describe("save", () => {
    it("should save notification to database", async () => {
      // Arrange
      const notification = TestDataBuilder.createEmailNotification();

      // Act
      const savedNotification = await notificationRepository.save(notification);

      // Assert
      expect(savedNotification).toBeDefined();
      expect(savedNotification.id).toBe(notification.id);
      expect(savedNotification.channel).toBe(notification.channel);
      expect(savedNotification.data).toBe(notification.data);

      // Verify it's actually in the database
      const dbNotification = await repository.findOne({
        where: { id: notification.id }
      });
      expect(dbNotification).toBeDefined();
      expect(dbNotification?.channel).toBe(NotificationChannel.EMAIL);
    });

    it("should update existing notification", async () => {
      // Arrange
      const notification = TestDataBuilder.createEmailNotification();
      await repository.save(notification);

      // Update status
      notification.status = NotificationStatus.SENT;

      // Act
      const updatedNotification = await notificationRepository.save(notification);

      // Assert
      expect(updatedNotification.status).toBe(NotificationStatus.SENT);

      // Verify in database
      const dbNotification = await repository.findOne({
        where: { id: notification.id }
      });
      expect(dbNotification?.status).toBe(NotificationStatus.SENT);
    });
  });

  describe("findById", () => {
    it("should find notification by id", async () => {
      // Arrange
      const notification = TestDataBuilder.createSMSNotification();
      await repository.save(notification);

      // Act
      const foundNotification = await notificationRepository.findById(notification.id);

      // Assert
      expect(foundNotification).toBeDefined();
      expect(foundNotification?.id).toBe(notification.id);
      expect(foundNotification?.channel).toBe(NotificationChannel.SMS);
    });

    it("should return null for non-existent id", async () => {
      // Act
      const foundNotification = await notificationRepository.findById("non-existent-id");

      // Assert
      expect(foundNotification).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should return all notifications when no filters provided", async () => {
      // Arrange
      const notification1 = TestDataBuilder.createEmailNotification();
      const notification2 = TestDataBuilder.createSMSNotification();
      await repository.save([notification1, notification2]);

      // Act
      const notifications = await notificationRepository.find();

      // Assert
      expect(notifications).toHaveLength(2);
      expect(notifications.map((n) => n.id)).toContain(notification1.id);
      expect(notifications.map((n) => n.id)).toContain(notification2.id);
    });

    it("should filter by channel", async () => {
      // Arrange
      const emailNotification = TestDataBuilder.createEmailNotification();
      const smsNotification = TestDataBuilder.createSMSNotification();
      await repository.save([emailNotification, smsNotification]);

      // Act
      const emailNotifications = await notificationRepository.find({
        channel: NotificationChannel.EMAIL
      });

      // Assert
      expect(emailNotifications).toHaveLength(1);
      expect(emailNotifications[0]?.channel).toBe(NotificationChannel.EMAIL);
    });

    it("should filter by status", async () => {
      // Arrange
      const pendingNotification = TestDataBuilder.createEmailNotification({
        status: NotificationStatus.PENDING
      });
      const sentNotification = TestDataBuilder.createSMSNotification({
        status: NotificationStatus.SENT
      });
      await repository.save([pendingNotification, sentNotification]);

      // Act
      const pendingNotifications = await notificationRepository.find({
        status: NotificationStatus.PENDING
      });

      // Assert
      expect(pendingNotifications).toHaveLength(1);
      expect(pendingNotifications[0]?.status).toBe(NotificationStatus.PENDING);
    });

    it("should apply limit and offset", async () => {
      // Arrange - Create 5 notifications
      const notifications = Array.from({ length: 5 }, () =>
        TestDataBuilder.createEmailNotification()
      );
      await repository.save(notifications);

      // Act
      const limitedNotifications = await notificationRepository.find({
        limit: 2,
        offset: 1
      });

      // Assert
      expect(limitedNotifications).toHaveLength(2);
    });
  });

  describe("remove", () => {
    it("should remove notification from database", async () => {
      // Arrange
      const notification = TestDataBuilder.createPushNotification();
      await repository.save(notification);

      // Verify it exists
      const beforeRemove = await repository.findOne({
        where: { id: notification.id }
      });
      expect(beforeRemove).toBeDefined();

      // Act
      await notificationRepository.remove(notification);

      // Assert
      const afterRemove = await repository.findOne({
        where: { id: notification.id }
      });
      expect(afterRemove).toBeNull();
    });
  });
});
