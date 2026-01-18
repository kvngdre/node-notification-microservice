import { describe, it, expect } from "vitest";
import { Notification } from "@domain/notification/notification-entity";
import { NotificationChannel, NotificationStatus } from "@domain/notification/types";
import { TestDataBuilder } from "../../helpers";

describe("Notification Entity", () => {
  describe("constructor", () => {
    it("should create notification with valid email data", () => {
      const notification = TestDataBuilder.createEmailNotification();

      expect(notification.id).toBeDefined();
      expect(notification.channel).toBe(NotificationChannel.EMAIL);
      expect(notification.status).toBe(NotificationStatus.PENDING);
      expect(notification.retryCount).toBe(0);
      expect(notification.createdAt).toBeInstanceOf(Date);
      expect(notification.updatedAt).toBeInstanceOf(Date);
      expect(notification.data).toBeDefined();
    });

    it("should create notification with valid SMS data", () => {
      const notification = TestDataBuilder.createSMSNotification();

      expect(notification.channel).toBe(NotificationChannel.SMS);
      expect(notification.status).toBe(NotificationStatus.PENDING);
    });

    it("should create notification with valid push data", () => {
      const notification = TestDataBuilder.createPushNotification();

      expect(notification.channel).toBe(NotificationChannel.PUSH);
      expect(notification.status).toBe(NotificationStatus.PENDING);
    });

    it("should generate unique IDs for different notifications", () => {
      const notification1 = TestDataBuilder.createEmailNotification();
      const notification2 = TestDataBuilder.createEmailNotification();

      expect(notification1.id).not.toBe(notification2.id);
    });

    it("should set custom status when provided", () => {
      const notification = TestDataBuilder.createEmailNotification({
        status: NotificationStatus.SENT
      });

      expect(notification.status).toBe(NotificationStatus.SENT);
    });

    it("should set custom retry count when provided", () => {
      const notification = TestDataBuilder.createEmailNotification({
        retryCount: 2
      });

      expect(notification.retryCount).toBe(2);
    });
  });

  describe("data parsing", () => {
    it("should store data as string for email notifications", () => {
      const notification = TestDataBuilder.createEmailNotification();

      expect(typeof notification.data).toBe("string");

      const parsedData = JSON.parse(notification.data);
      expect(parsedData).toHaveProperty("from");
      expect(parsedData).toHaveProperty("to");
      expect(parsedData).toHaveProperty("subject");
      expect(parsedData).toHaveProperty("body");
    });

    it("should store data as string for SMS notifications", () => {
      const notification = TestDataBuilder.createSMSNotification();

      expect(typeof notification.data).toBe("string");

      const parsedData = JSON.parse(notification.data);
      expect(parsedData).toHaveProperty("to");
      expect(parsedData).toHaveProperty("body");
    });
  });

  describe("business rules", () => {
    it("should have pending status by default", () => {
      const notification = new Notification(
        NotificationChannel.EMAIL,
        '{"test": "data"}',
        undefined, // Let it default
        0
      );

      expect(notification.status).toBe(NotificationStatus.PENDING);
    });

    it("should have zero retry count by default", () => {
      const notification = new Notification(
        NotificationChannel.EMAIL,
        '{"test": "data"}',
        NotificationStatus.PENDING
        // Let retryCount default
      );

      expect(notification.retryCount).toBe(0);
    });

    it("should set createdAt and updatedAt to current time", () => {
      const before = new Date();
      const notification = TestDataBuilder.createEmailNotification();
      const after = new Date();

      expect(notification.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(notification.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(notification.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(notification.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
