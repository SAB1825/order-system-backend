import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env.config";
import { logger } from "./utils/logger";
import { closeDb, connectToDB } from "./config/db.config";
import { initModels } from "./models";
import { closePublisher, initPublisher } from "./messaging/event-publishing";
import { connectRedis } from "./config/redis.config";

export const startServer = async () => {
  try {
    await connectToDB();
    await initModels();
    await initPublisher();
    await connectRedis();

    const app = createApp();
    const server = createServer(app);
    const PORT = env.AUTH_SERVICE_PORT;
    server.listen(PORT, () => {
      logger.info({ PORT }, "Auth-Service is running.");
    });

    const shutdown = () => {
      logger.info("Auth-Service is shutting down");

      Promise.all([closeDb(), closePublisher()])
        .catch((error: unknown) => {
          logger.error({ error }, "Error during shutdown Auth-Service");
        })
        .finally(() => {
          server.close(() => process.exit(0));
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error({ error }, "Failed to start Auth-Service");
    process.exit(1);
  }
};

void startServer();
