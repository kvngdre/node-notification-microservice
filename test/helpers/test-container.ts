import { Container } from "inversify";
import { vi } from "vitest";
import { ILogger } from "@shared-kernel/logger-interface";
import { INotificationRepository } from "@domain/notification/notification-repository-interface";

/**
 * Creates a test container with mocked dependencies for unit testing
 */
export function createTestContainer(): Container {
  const testContainer = new Container();

  // Mock logger
  const mockLogger: ILogger = {
    logInfo: vi.fn(),
    logDebug: vi.fn(),
    logError: vi.fn(),
    logWarn: vi.fn(),
    logHttp: vi.fn()
  };

  // Mock repository
  const mockRepository: INotificationRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    find: vi.fn(),
    remove: vi.fn()
  };

  // Bind mocks to container
  testContainer.bind<ILogger>("Logger").toConstantValue(mockLogger);
  testContainer
    .bind<INotificationRepository>("NotificationRepository")
    .toConstantValue(mockRepository);

  return testContainer;
}

/**
 * Get mock implementations from the test container
 */
export function getMocks(container: Container) {
  return {
    logger: container.get<ILogger>("Logger"),
    repository: container.get<INotificationRepository>("NotificationRepository")
  };
}
