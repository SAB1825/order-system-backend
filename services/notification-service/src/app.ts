import type { Application } from "express";
import express, { urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(urlencoded({ extended: true }));

  app.use((_req, res) => {
    res.status(404).json({
      message: "Not Found",
    });
  });

  return app;
};
