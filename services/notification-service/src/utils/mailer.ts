import nodeMailer from "nodemailer";
import { env } from "../config/env.config";

export const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: env.GMAIL_APP_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
  secure: true,
  port: 465,
});
