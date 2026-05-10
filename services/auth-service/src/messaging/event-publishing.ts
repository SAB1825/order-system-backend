import { env } from "@/config/env.config";
import { AuthRegisteredEventPayload } from "@/types/auth";
import { logger } from "@/utils/logger";
import { AuthEvents } from "@backend/shared/src";
import { connect, type Channel, type ChannelModel } from "amqplib";

let channel: Channel | null = null;
let connectionRef: ChannelModel | null = null;

export const initPublisher = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn(
      "RABBITMQ_URL is not defined. Skipping RabbitMQ initialization.",
    );
    return;
  }

  if (channel) {
    return;
  }

  const connection = await connect(env.RABBITMQ_URL);
  connectionRef = connection;

  channel = await connection.createChannel();
  await channel?.assertExchange(AuthEvents.EXCHANGE, "topic", {
    durable: true,
  });

  connection.on("close", () => {
    logger.warn("RabbitMQ connection closed");
    channel = null;
    connectionRef = null;
  });
  connection.on("error", (err) => {
    logger.error({ err }, "RabbitMQ connection error");
  });

  logger.info("Auth Service RabbitMq publisher initialized");
};

export const publishUserRegister = async (
  payload: AuthEvents.UserRegistered.Payload,
) => {
  if (!channel) {
    logger.warn("RabbitMq channeldis not initialized. Cannot publish message.");
    return;
  }

  const event: AuthEvents.UserRegistered.Event = {
    type: AuthEvents.UserRegistered.ROUTING_KEY,
    payload: payload,
    occuredAt: new Date().toISOString(),
  };

  const published = channel.publish(
    AuthEvents.EXCHANGE,
    AuthEvents.UserRegistered.ROUTING_KEY,
    Buffer.from(JSON.stringify(event)),
    { contentType: "application/json", persistent: true },
  );
  if (!published) {
    logger.warn({ event }, "Failed to publish user registered event");
  }
};

export const closePublisher = async () => {
  try {
    const ch = channel;
    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connectionRef;

    if (conn) {
      await conn.close();
      connectionRef = null;
    }
  } catch (error) {
    logger.error({ error }, "Error closing RabbitMq connection/channel");
  }
};
