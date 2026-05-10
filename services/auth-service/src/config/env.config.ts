import "dotenv/config";

import { createEnv, z } from "@backend/shared";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4000),
  AUTH_DB_URL: z.url(),
  RABBITMQ_URL: z.url(),
});

type EnvType = z.infer<typeof EnvSchema>;

export const env: EnvType = createEnv(EnvSchema, {
  serviceName: "auth-service",
});

export type Env = typeof env;
