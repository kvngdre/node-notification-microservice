export interface IWebAppOptions {
  port?: number;
  cors?: {
    allowedOrigins: string | string[];
    methods: string | string[];
    allowedHeaders: string | string[];
  };
}
