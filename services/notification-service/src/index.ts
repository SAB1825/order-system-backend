import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env.config";
import { logger } from "./utils/logger";
import { startAuthEventConsumer } from "./messaging/event-consumer";

export const startServer = async () => {
  try {
    await startAuthEventConsumer();

    const app = createApp();
    const server = createServer(app);
    const PORT = env.NOTIFICATION_SERVICE_PORT;
    server.listen(PORT, () => {
      logger.info({ PORT }, "Notification-Service is running.");
    });

    const shutdown = () => {
      logger.info("Notification-Service is shutting down");

      Promise.all([])
        .catch((error: unknown) => {
          logger.error({ error }, "Error during shutdown Notification-Service");
        })
        .finally(() => {
          server.close(() => process.exit(0));
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error({ error }, "Failed to start Notification-Service");
    process.exit(1);
  }
};

void startServer();
