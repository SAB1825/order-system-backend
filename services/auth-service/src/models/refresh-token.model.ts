import { sequelize } from "@/config/db.config";
import { DataTypes, Model, type Optional } from "sequelize";
import { userCredential } from "./user-credentials.model";

export interface RefreshTokenAttributes {
  id: string;
  userId: string;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class refreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string;
  declare userId: string;
  declare tokenId: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

refreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
  },
);

userCredential.hasMany(refreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

refreshToken.belongsTo(userCredential, {
  foreignKey: "userId",
  as: "user",
});
