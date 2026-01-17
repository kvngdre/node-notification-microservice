import { type Server } from "http";
import { type IWebAppOptions } from "./abstractions/interfaces";
import express, { json, urlencoded, type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { Environment } from "src/shared-kernel";
import { apiRouter } from "./routers/api-router";
import { AbstractErrorMiddleware, AbstractMiddleware } from "./abstractions/types";
import { ILogger } from "@shared-kernel/logger-interface";
import { IGlobalErrorHandler } from "./utils/global-error-handler";
import container from "src/di-container";

/**
 * WebApp class responsible for configuring and running the Express.js server.
 * Handles middleware registration, routing setup, and server lifecycle management.
 * Uses dependency injection for middleware and logging dependencies.
 */
export default class WebApp {
  private readonly _app: Express = express();
  /** HTTP server instance, null until server starts */
  private _server: Server | null = null;
  private _options: IWebAppOptions = { port: 3000 };

  private readonly _requestLoggingMiddleware: AbstractMiddleware;
  private readonly _resourceNotFoundMiddleware: AbstractMiddleware;
  private readonly _errorHandlingMiddleware: AbstractErrorMiddleware;
  private readonly _logger: ILogger;

  /**
   * Initialize WebApp with dependency injection and configuration options.
   * Resolves all required middleware and services from the DI container.
   * @param options - Server configuration options including port
   */
  constructor(options: IWebAppOptions) {
    try {
      // Resolve middleware dependencies from DI container
      this._requestLoggingMiddleware = container.get("RequestLoggingMiddleware");
      this._resourceNotFoundMiddleware = container.get("ResourceNotFoundMiddleware");
      this._errorHandlingMiddleware = container.get("ErrorHandlingMiddleware");
      this._logger = container.get("Logger");
    } catch (error) {
      throw new Error(`DI container resolution failed: ${error}`);
    }

    this.setOptions(options);
  }

  /**
   * Get current server configuration options.
   * @returns Current WebApp options
   */
  public getOptions(): IWebAppOptions {
    return this._options;
  }

  /**
   * Update server configuration options with validation.
   * @param options - Partial options to merge with current configuration
   */
  public setOptions(options: Partial<IWebAppOptions>): void {
    this.parsePortNumberOrThrow(options.port ?? this._options?.port);

    this._options = { ...this._options, ...options };
  }

  /**
   * Configure Express middleware pipeline and start the HTTP server.
   * Middleware order is critical: security -> parsing -> logging -> routing -> error handling.
   */
  public run(): void {
    try {
      // Security middleware
      this._app.use(cors());
      this._app.use(helmet());

      // Body parsing middleware
      this._app.use(json());
      this._app.use(urlencoded({ extended: true }));

      // Request logging middleware
      this._app.use(this._requestLoggingMiddleware.execute);

      // API routes
      this._app.use("/api/v1", apiRouter);
      // Catch-all for undefined routes (404 handler)
      this._app.use("*", this._resourceNotFoundMiddleware.execute);

      // Global error handling middleware (must be last)
      this._app.use(this._errorHandlingMiddleware.execute);

      // Start HTTP server
      this._server = this._app.listen(this._options.port, () => {
        if (Environment.isDevelopment) {
          this._logger.logDebug(`Server running on port: ${this._options.port}`);
          this._logger.logInfo(`API docs: http://localhost:${this._options.port}/api/v1`);
        } else {
          console.log(`Server running on port: [${this._options.port}]`);
        }
      });

      // Register process listeners after server starts
      this.registerProcessListeners();

      // Handle server-level errors
      this._server.on("error", (error) => {
        this._logger.logError("Server error:", error);
        throw error;
      });
    } catch (error) {
      this._logger.logError("Failed to start server:", error);
      throw error;
    }
  }

  /**
   * Register global process listeners for graceful shutdown and error handling.
   * Must be called after server is created to ensure proper cleanup.
   */
  private registerProcessListeners(): void {
    const errorHandler = container.get<IGlobalErrorHandler>("GlobalErrorHandler");

    process.on("uncaughtException", (error: Error) => {
      this._logger.logError("Uncaught Exception:", error);
      errorHandler.handle(error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
      this._logger.logError("Unhandled Rejection at:", { promise, reason });
      throw reason;
    });

    process.on("SIGTERM", () => {
      this._logger.logInfo("SIGTERM received, shutting down gracefully");
      this.gracefulShutdown();
    });

    process.on("SIGINT", () => {
      this._logger.logInfo("SIGINT received, shutting down gracefully");
      this.gracefulShutdown();
    });
  }

  /**
   * Perform graceful shutdown of server and cleanup resources.
   */
  private gracefulShutdown(): void {
    if (this._server) {
      this._server.close(() => {
        this._logger.logInfo("Server closed successfully");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }

  /**
   * Validate port number is within valid range (1-65535).
   * @param value - Port number to validate
   * @throws Error if port is invalid
   */
  private parsePortNumberOrThrow(value: number | string) {
    const port = Number(value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port: ${value}. Must be 1-65535`);
    }
  }
}
