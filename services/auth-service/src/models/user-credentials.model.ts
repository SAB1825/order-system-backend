import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/db.config";

export interface UserCredentialEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCredentialCreationEntity = Optional<
  UserCredentialEntity,
  "id" | "createdAt" | "updatedAt" | "email_verified"
>;

export class userCredential
  extends Model<UserCredentialEntity, UserCredentialCreationEntity>
  implements UserCredentialEntity
{
  declare id: string;
  declare name: string;
  declare email: string;
  declare password_hash: string;
  declare email_verified: boolean;
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
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password_hash: {
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
