import { sequelize } from "@/config/db.config";
import { userCredential } from "./user-credentials.model";
import { refreshToken } from "./refresh-token.model";

export const initModels = async () => {
  await sequelize.sync();
};

export { userCredential, refreshToken };
