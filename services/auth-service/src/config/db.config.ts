import { Sequelize } from "sequelize";

import { logger } from "@/utils/logger";
import { env } from "./env.config";

export const sequelize = new Sequelize(env.AUTH_DB_URL, {
  dialect: "postgres",
  logging:
    env.NODE_ENV === "development"
      ? (msg: unknown) => {
          logger.debug({ sequelize: msg });
        }
      : false,

  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectToDB = async () => {
  await sequelize.authenticate();
  logger.info("Auth Database Connected.");
};

export const closeDb = async () => {
  await sequelize.close();
  logger.info("Auth Database connection closed.");
};