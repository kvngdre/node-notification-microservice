/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import NotificationsController from "@web/controllers/notifications-controller";

describe("NotificationsController", () => {
  let app: Express;
  let mockController: NotificationsController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Create mock controller
    mockController = {
      createNotification: vi.fn(),
      sendNotification: vi.fn(),
      getNotificationById: vi.fn(),
      getNotifications: vi.fn(),
      deleteNotificationById: vi.fn()
    } as any;

    // Set up routes manually for testing
    app.post("/api/v1/notifications", (req, res) => mockController.createNotification(req, res));
    app.post("/api/v1/notifications/send", (req, res) => mockController.sendNotification(req, res));
    app.get("/api/v1/notifications/:notificationId", (req, res) =>
      mockController.getNotificationById(req, res)
    );
    app.get("/api/v1/notifications", (req, res) => mockController.getNotifications(req, res));
    app.delete("/api/v1/notifications/:notificationId", (req, res) =>
      mockController.deleteNotificationById(req, res)
    );
  });

  describe("POST /api/v1/notifications", () => {
    it("should call createNotification method", async () => {
      // Arrange
      const requestBody = {
        channel: "EMAIL",
        data: JSON.stringify({
          alias: "System",
          from: "noreply@example.com",
          to: "user@example.com",
          subject: "Test Email",
          body: "This is a test email notification"
        }),
        status: "PENDING",
        retryCount: 0
      };

      const mockResponse = {
        success: true,
        message: "Notification created",
        data: { id: "test-id" }
      };

      mockController.createNotification = vi.fn().mockImplementation((_, res) => {
        res.status(200).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .post("/api/v1/notifications")
        .send(requestBody)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockController.createNotification).toHaveBeenCalled();
    });
  });

  describe("GET /api/v1/notifications/:notificationId", () => {
    it("should call getNotificationById method", async () => {
      // Arrange
      const notificationId = "test-notification-id";
      const mockResponse = {
        success: true,
        message: "Notification retrieved",
        data: { id: notificationId }
      };

      mockController.getNotificationById = vi.fn().mockImplementation((_, res) => {
        res.status(200).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .get(`/api/v1/notifications/${notificationId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockController.getNotificationById).toHaveBeenCalled();
    });
  });

  describe("GET /api/v1/notifications", () => {
    it("should call getNotifications method", async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: "Notifications retrieved",
        data: []
      };

      mockController.getNotifications = vi.fn().mockImplementation((_, res) => {
        res.status(200).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .get("/api/v1/notifications")
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockController.getNotifications).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/v1/notifications/:notificationId", () => {
    it("should call deleteNotificationById method", async () => {
      // Arrange
      const notificationId = "test-notification-id";
      const mockResponse = {
        success: true,
        message: "Notification deleted"
      };

      mockController.deleteNotificationById = vi.fn().mockImplementation((_, res) => {
        res.status(200).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .delete(`/api/v1/notifications/${notificationId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockController.deleteNotificationById).toHaveBeenCalled();
    });
  });

  describe("POST /api/v1/notifications/send", () => {
    it("should call sendNotification method", async () => {
      // Arrange
      const requestBody = {
        channel: "EMAIL",
        data: {
          alias: "System",
          from: "noreply@example.com",
          to: "user@example.com",
          subject: "Test Email",
          body: "This is a test email notification"
        }
      };

      const mockResponse = {
        success: true,
        message: "Notification sent successfully",
        data: "test-id"
      };

      mockController.sendNotification = vi.fn().mockImplementation((_, res) => {
        res.status(200).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .post("/api/v1/notifications/send")
        .send(requestBody)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockResponse);
      expect(mockController.sendNotification).toHaveBeenCalled();
    });
  });
});
