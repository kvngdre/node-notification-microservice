declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URI: string;
      RMQ_HOST: string;
      RMQ_PORT: string;
      RMQ_EXCHANGE_NAME: string;
      RMQ_EXCHANGE_TYPE: string;
      RMQ_MAIN_QUEUE_ROUTING_KEY: string;
      RMQ_MAIN_QUEUE_NAME: string;
      RMQ_DLQ_ROUTING_KEY: string;
      RMQ_DLQ_NAME: string;
    }
  }
}

export {};
