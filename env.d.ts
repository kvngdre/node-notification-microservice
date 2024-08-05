declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URI: string;
      RMQ_HOST: string;
      RMQ_PORT: string;
      RMQ_QUEUE_NAME: string;
      RMQ_EXCHANGE_NAME: string;
      RMQ_EXCHANGE_TYPE: string;
      RMQ_ROUTING_KEY: string;
      RMQ_QUEUE_NAME: string;
    }
  }
}

export {};
