import { DataTypes, Sequelize, UUIDV4 } from "sequelize";
import sequelize from "../config/sequelize";
import userInformation from "../../types/modelTypes/userInformation";

userInformation.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
      unique: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "userInformation",
    tableName: "user_information",
    underscored: true,
  }
);

export default userInformation;
