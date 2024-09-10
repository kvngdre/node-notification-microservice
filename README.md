# Notification Microservice

Welcome to the Notification Microservice, a TypeScript-based service designed to handle and deliver notifications efficiently and reliably. This service is built with scalability and performance in mind to ensure robust operation even under high load.

The architecture I had in mind was chosen for scalability and efficiency as I did not want to run my bank accounts into the ground. It involves a microservice which is this and a worker node.

## Software Architecture

This microservice is crafted with a focus on scalable and efficient architecture, integrating the following principles and patterns:

- [Robert C. Martin's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html): Structured to ensure separation of concerns and independent maintainability.
- [Domain-Driven Design(DDD)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design): Applied to align the software model closely with the business domain and logic.

### Components

- **Notification Microservice**: Handles the core notification logic and operations.
- **[Worker Node](https://github.com/kvngdre/node-notification-microservice-worker-node)**: Manages background tasks and processes notifications asynchronously.

## Features

- **Daily Log Rotation**: Automatically rotates logs daily to manage log file size and maintain performance.
- **Dependency Injection**: Utilizes dependency injection to manage service dependencies and improve testability.
- **CQRS Pattern (Command Query Responsibility Segregation)**: Separates command (write) and query (read) responsibilities for optimized performance and scalability.
- **Mediator Pattern**: Facilitates communication between components and handles requests and responses in a decoupled manner.
- **Request Handler Self Discovery and Registration**: Automatically discovers and registers request handlers to streamline the addition of new handlers.
- **Asynchronous Communication**: Interfaces with notification worker(s) to handle background processing and ensure efficient notification delivery.
- **Message Broker Integration with RabbitMQ**: Utilizes RabbitMQ for reliable and scalable message queuing, ensuring robust message handling and delivery.
- **Dead Letter Queue**: Handles failed notification retries to ensure robust error management.

## Planned Features

The project roadmap includes the following potential features:

1. Webhook Support: Integrate webhooks for real-time event notifications and enhanced integration with third-party systems.

2. Priority-based Notification Delivery: Support for different priority levels to ensure urgent notifications are delivered first.

3. Advanced Retry Policies: Implement customizable retry policies with exponential backoff, giving users fine control over retry strategies for failed notifications.

4. Rate Limiting & Throttling: Implement rate-limiting mechanisms to avoid overloading email/SMS providers, ensuring compliance with service limits.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/package-manager) (version 20.0.0 or later)
- [RabbitMQ](https://www.rabbitmq.com/) (for message brokering)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerization)

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/kvngdre/node-notification-microservice.git
   cd node-notification-microservice
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

### Configuration

1. **Set up environment variables**: Create a `.env` file in the root directory and configure the necessary environment variables. Example:

   ```text
   # DB
   DB_URI=postgres://user:password@127.0.0.1:5432/notification-microservice
   ```

### Running the Service

You have two options to run the service:

#### Option 1: Using Docker Compose

Docker Compose simplifies the process of running the microservice along with its dependencies.

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the project directory:

   ```sh
   cd path/to/your/repository
   ```

3. Start the services using Docker Compose:

   ```sh
   docker-compose -f docker-compose.notification-ms.yml up
   ```

   This command will start RabbitMQ, PostgreSQL, and the API services. The API service will be available on port 8822, RabbitMQ management console on port 15672, and PostgreSQL on port 5432

4. Stop the services:

   ```sh
   docker-compose down
   ```

#### Option 2: Manual Setup

If you prefer to run the services manually or do not use Docker Compose, follow these steps:

1. Start RabbitMQ:

   ```sh
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

2. Start PostgresSQL:

   ```sh
   docker run -d --name notification_ms_database -p 5432:5432 -e POSTGRES_DB=notification-microservice -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:13.3-alpine
   ```

3. Start the API service:

   ```sh
   npm start
   ```

## Feature Requests

I welcome and encourage feature requests to help improve the Notification Microservice. To submit a feature request, please follow these steps:

1. Go to the [issues page](https://github.com/kvngdre/node-notification-microservice/issues) of this repository.
2. **Check Existing Issues**: Before submitting a new feature request, please check if your idea has already been proposed or discussed. You can use the search bar to find related issues.
3. Submit a New Issue: If your feature request is not already listed, click on the "New issue" button to create a new issue.
4. Provide Details:

   - Title: Write a clear and concise title for your feature request.
   - Description: Describe the feature you are requesting in detail. Include information such as:
     - Use Case: Why do you think this feature is necessary? What problem does it solve?
     - Proposed Solution: How do you envision the feature working? What specific functionality should it include?
     - Additional Context: Provide any additional information or context that might help in understanding the feature request.

5. Submit: Click "Submit new issue" to create your feature request.

I appreciate your contributions and will review your request as soon as possible.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/[feature_name]`).
3. Commit your changes (`git commit -am "Add new [feature_name] feature"`).
4. Push to the branch (`git push origin feature/[feature_name]`).
5. Create a new pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE.md) file for details
