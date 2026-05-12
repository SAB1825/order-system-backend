import "dotenv/config";

import { createEnv, z } from "@backend/shared";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NOTIFICATION_SERVICE_PORT: z.coerce
    .number()
    .int()
    .min(0)
    .max(65_535)
    .default(4000),
  RABBITMQ_URL: z.url(),
  GMAIL_APP_PASSWORD: z.string(),
  GMAIL_APP_USER: z.string(),
});

type EnvType = z.infer<typeof EnvSchema>;

export const env: EnvType = createEnv(EnvSchema, {
  serviceName: "auth-service",
});

export type Env = typeof env;
