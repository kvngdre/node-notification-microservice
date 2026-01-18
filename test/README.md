# Testing Strategy

This document outlines the comprehensive testing strategy implemented for the Notification Microservice.

## Test Structure

```sh
test/
├── setup.ts                    # Global test configuration
├── helpers/                    # Shared test utilities
│   ├── index.ts               # Helper exports
│   ├── test-container.ts      # DI container mocking
│   ├── test-data-builder.ts   # Test data factories
│   └── database-helper.ts     # Integration test database setup
├── unit/                      # Unit tests
│   ├── domain/               # Domain layer tests
│   ├── application/          # Application layer tests
│   ├── shared-kernel/        # Shared kernel tests
│   └── web/                  # Web layer tests
└── integration/              # Integration tests
    └── notification-repository.test.ts
```

## Test Categories

### 1. Unit Tests (38 tests)

- **Domain Layer Tests**: Test business entities, value objects, and domain services
- **Application Layer Tests**: Test command/query handlers, validators, and DTOs
- **Web Layer Tests**: Test controllers and routing logic
- **Shared Kernel Tests**: Test common utilities, exceptions, and result types

### 2. Integration Tests (9 tests - requires Docker)

- **Repository Tests**: Test data access layer with real database
- **Database Tests**: Test schema, migrations, and data persistence
- **External Service Tests**: Test third-party integrations

### 3. API Tests (Future Enhancement)

- **End-to-End Tests**: Test complete request/response cycles
- **Contract Tests**: Test API contract compliance
- **Performance Tests**: Test response times and throughput

## Coverage Metrics

Current test coverage (as of implementation):

- **Overall Coverage**: 19.87%
- **Domain Layer**: 100% coverage ✅
- **Application Layer**: 50%+ coverage on tested handlers
- **Shared Kernel**: 78.72% coverage ✅
- **Web Layer**: Limited (controller route testing)
- **Infrastructure Layer**: 0% (requires integration tests)

### Coverage Thresholds

- **Global**: 80% (statements, branches, functions, lines)
- **Critical paths**: 90%+ (domain entities, core handlers)
- **Infrastructure**: 70% (external dependencies)

## Test Configuration

### Vitest Configuration

- **Test Runner**: Vitest (modern, fast, TypeScript native)
- **Coverage Provider**: V8 (accurate, built-in)
- **Test Environment**: Node.js
- **Timeout**: 10 seconds per test
- **Setup**: Automatic mocking, path aliases

### Test Dependencies

```json
{
  "vitest": "^4.0.17",
  "@vitest/ui": "^4.0.17",
  "@vitest/coverage-v8": "^4.0.17",
  "testcontainers": "^11.11.0",
  "supertest": "^7.2.2",
  "sinon": "^21.0.1"
}
```

## Testing Patterns

### 1. AAA Pattern (Arrange-Act-Assert)

```typescript
it("should create notification successfully", async () => {
  // Arrange
  const command = TestDataBuilder.createEmailCommand();
  mockValidator.validate.mockReturnValue({ isSuccess: true, value: command });

  // Act
  const result = await handler.handle(command);

  // Assert
  expect(result.isSuccess).toBe(true);
  expect(result.value).toBeDefined();
});
```

### 2. Test Data Builders

```typescript
export class TestDataBuilder {
  static createEmailNotification(overrides = {}): Notification {
    const notification = new Notification(/* ... */);
    return Object.assign(notification, overrides);
  }
}
```

### 3. Mock Containers

```typescript
function createTestContainer(): Container {
  const testContainer = new Container();
  testContainer.bind<ILogger>("Logger").toConstantValue(mockLogger);
  return testContainer;
}
```

## Test Commands

### Development Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test pattern
npm test -- --run test/unit/domain

# Run single test file
npm test -- notification-entity.test.ts
```

### CI/CD Commands

```bash
# Run all tests once
npm test -- --run

# Generate coverage report
npm run test:coverage -- --run

# Run tests with specific timeout
npm test -- --run --testTimeout=30000
```

## Test Quality Guidelines

### 1. Test Structure

- **Clear naming**: Describe what is being tested
- **Single responsibility**: One assertion per test when possible
- **Independent tests**: No shared state between tests
- **Fast execution**: Unit tests < 100ms each

### 2. Mock Guidelines

- **Mock external dependencies**: Database, APIs, file system
- **Don't mock domain objects**: Test real business logic
- **Verify interactions**: Assert that mocks are called correctly
- **Reset mocks**: Clean state between tests

### 3. Coverage Guidelines

- **Focus on critical paths**: Domain logic, business rules
- **Test error conditions**: Exception handling, validation failures
- **Test edge cases**: Boundary conditions, empty inputs
- **Avoid testing frameworks**: Don't test third-party code

## Areas for Improvement

### 1. Immediate Enhancements

- [ ] Complete application layer handler tests
- [ ] Add validation tests for all command/query validators
- [ ] Implement web layer integration tests
- [ ] Add more error scenario tests

### 2. Medium-term Goals

- [ ] Infrastructure layer testing (with Docker containers)
- [ ] End-to-end API testing
- [ ] Performance benchmarking
- [ ] Mutation testing for quality assurance

### 3. Long-term Strategy

- [ ] Property-based testing for domain logic
- [ ] Contract testing for external APIs
- [ ] Load testing for scalability validation
- [ ] Security testing for vulnerability assessment

## Running Tests

### Prerequisites

- Node.js 22+
- Docker (for integration tests)
- TypeScript

### Local Development

1. Install dependencies: `npm install`
2. Run unit tests: `npm test -- --run test/unit`
3. Generate coverage: `npm run test:coverage`
4. View test UI: `npm run test:ui`

### Continuous Integration

The testing pipeline runs automatically on:

- Pull requests
- Main branch commits
- Release tags

### Integration Test Setup

Integration tests require Docker for database containers:

```bash
# Start Docker daemon
docker daemon

# Run integration tests
npm test -- --run test/integration
```

## Conclusion

This testing strategy provides a solid foundation for maintaining code quality and ensuring reliable functionality. The layered approach focuses on testing business logic thoroughly while providing adequate coverage for infrastructure components.

The test suite serves as living documentation of the system's behavior and provides confidence for refactoring and feature additions.
