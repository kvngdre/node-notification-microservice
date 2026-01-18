import { Notification } from "@domain/notification/notification-entity";
import { NotificationChannel, NotificationStatus } from "@domain/notification/types";
import { CreateNotificationCommand } from "@application/notifications/commands/create/create-notification-command";
import { SendNotificationCommand } from "@application/notifications/commands/send/send-notification-command";

/**
 * Test data builders for creating consistent test fixtures
 */
export class TestDataBuilder {
  /**
   * Create a sample email notification entity
   */
  static createEmailNotification(overrides: Partial<Notification> = {}): Notification {
    const notification = new Notification(
      NotificationChannel.EMAIL,
      JSON.stringify({
        alias: "System",
        from: "noreply@example.com",
        to: "user@example.com",
        subject: "Test Email",
        body: "This is a test email notification"
      }),
      NotificationStatus.PENDING,
      0
    );

    // Apply overrides
    Object.assign(notification, overrides);

    return notification;
  }

  /**
   * Create a sample SMS notification entity
   */
  static createSMSNotification(overrides: Partial<Notification> = {}): Notification {
    const notification = new Notification(
      NotificationChannel.SMS,
      JSON.stringify({
        to: "+2347012345678",
        body: "Test SMS message"
      }),
      NotificationStatus.PENDING,
      0
    );

    Object.assign(notification, overrides);
    return notification;
  }

  /**
   * Create a sample push notification entity
   */
  static createPushNotification(overrides: Partial<Notification> = {}): Notification {
    const notification = new Notification(
      NotificationChannel.PUSH,
      JSON.stringify({
        deviceToken: "test_device_token_123",
        title: "Test Push",
        body: "This is a test push notification"
      }),
      NotificationStatus.PENDING,
      0
    );

    Object.assign(notification, overrides);
    return notification;
  }

  /**
   * Create a CreateNotificationCommand for testing
   */
  static createEmailCommand(
    overrides: Partial<CreateNotificationCommand> = {}
  ): CreateNotificationCommand {
    const command = new CreateNotificationCommand(
      NotificationChannel.EMAIL,
      JSON.stringify({
        alias: "System",
        from: "noreply@example.com",
        to: "user@example.com",
        subject: "Test Email",
        body: "This is a test email notification"
      }),
      0,
      NotificationStatus.PENDING
    );

    Object.assign(command, overrides);
    return command;
  }

  /**
   * Create a SendNotificationCommand for testing
   */
  static createSendEmailCommand(): SendNotificationCommand {
    return new SendNotificationCommand(
      NotificationChannel.EMAIL,
      {
        alias: "System",
        from: "noreply@example.com",
        to: "user@example.com",
        subject: "Test Email",
        body: "This is a test email notification"
      } as any // Type assertion for test data
    );
  }

  /**
   * Create a SendNotificationCommand for SMS testing
   */
  static createSendSmsCommand(): SendNotificationCommand {
    return new SendNotificationCommand(NotificationChannel.SMS, {
      to: "+2347012345678",
      message: "Test SMS message"
    } as any);
  }

  /**
   * Create a SendNotificationCommand for Push testing
   */
  static createSendPushCommand(): SendNotificationCommand {
    return new SendNotificationCommand(NotificationChannel.PUSH, {
      userId: "user123",
      title: "Test Push",
      body: "This is a test push notification"
    } as any);
  }

  /**
   * Create SMS notification for testing
   */
  static createSmsNotification(overrides: Partial<Notification> = {}): Notification {
    const notification = new Notification(
      NotificationChannel.SMS,
      JSON.stringify({
        to: "+2347012345678",
        message: "Test SMS message"
      }),
      NotificationStatus.PENDING,
      0
    );

    Object.assign(notification, overrides);
    return notification;
  }

  /**
   * Create invalid notification data for error testing
   */
  static createInvalidEmailData() {
    return {
      channel: NotificationChannel.EMAIL,
      data: {
        from: "invalid-email", // Invalid email format
        to: "", // Empty required field
        subject: "", // Empty required field
        body: "x".repeat(3000) // Exceeds max length
      }
    };
  }
}
