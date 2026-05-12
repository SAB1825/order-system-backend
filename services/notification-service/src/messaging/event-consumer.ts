import {
  Channel,
  type ChannelModel,
  type Connection,
  connect,
  ConsumeMessage,
  Replies,
} from "amqplib";
import { env } from "../config/env.config";
import { AuthEvents } from "@backend/shared/dist";
import { logger } from "../utils/logger";
import { registerOtpService } from "../services/auth-email.service";

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = "auth-service.auth-events";

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString("utf-8");
  const event = JSON.parse(raw) as AuthEvents.UserRegistered.Event;

  await registerOtpService(
    event.payload.email,
    event.payload.otp,
    event.payload.name,
  );
  ch.ack(message);
};

export const startAuthEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn("RabbitMQ URL is not configured, skip");
    return;
  }

  if (channel) {
    return;
  }

  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(AuthEvents.EXCHANGE, "topic", { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
  await ch.bindQueue(
    queue.queue,
    AuthEvents.EXCHANGE,
    AuthEvents.UserRegistered.ROUTING_KEY,
  );

  const consumeHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    void handleMessage(msg, ch).catch((error: unknown) => {
      logger.error({ err: error }, "Failed to proccess auth event");
      ch.nack(msg, false, false);
    });
  };

  const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);
  consumerTag = result.consumerTag;

  connection.on("close", () => {
    logger.warn("Auth consumer connection closed");
    connectionRef = null;
    channel = null;
    consumerTag = null;
    consumerTag = null;
  });

  connection.on("error", (error) => {
    logger.error({ err: error }, "Auth consumer connection error");
  });

  logger.info("Auth event consumer started");
};

const closeConnection = async (conn: ManageConnection) => {
  await conn.close();
  connectionRef = null;
  channel = null;
  consumerTag = null;
};

export const stopAuthEventConsume = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag);
      consumerTag = null;
    }
    if (ch) {
      await ch.close();
      channel = null;
    }
    const conn = connectionRef;
    if (conn) {
      await closeConnection(conn);
      connectionRef = null;
    }
  } catch (error) {
    logger.error({ err: error }, "Failed to stop auth event consumer");
  }
};
