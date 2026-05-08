import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/db.config";

export interface UserCredentialEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCredentialCreationEntity = Optional<
  UserCredentialEntity,
  "id" | "createdAt" | "updatedAt"
>;

export class userCredential
  extends Model<UserCredentialEntity, UserCredentialCreationEntity>
  implements UserCredentialEntity
{
  declare id: string;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

userCredential.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    tableName: "user_credentials",
  },
);
