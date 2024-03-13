import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import userInformation from "./userInformation";
import notification from "../../types/modelTypes/notification";

notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_information",
        key: "id",
      },
    },
    context: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prop: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "notification",
    tableName: "notification",
    underscored: true,
  }
);

// Define associations
userInformation.hasMany(notification, {
  foreignKey: "userId",
});
notification.belongsTo(userInformation, {
  foreignKey: "userId",
});

export default notification;
