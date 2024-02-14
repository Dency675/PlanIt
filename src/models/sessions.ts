import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import Session from "../../types/modelTypes/sessions";

import TeamInformation from "./teamInformation";
import UserInformation from "./userInformation";
import Estimations from "./estimations";
import calculations from "./calculations";

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
   
    sessionTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timer: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    excelLink: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "team_information",
        key: "id",
      },
    },
    scrumMasterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_information",
        key: "id",
      },
    },
    estimationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "estimations",
        key: "id",
      },
    },
    calculationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "calculations",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("not started", "active", "completed"),
      allowNull: false,
      defaultValue: "not started",
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
    modelName: "Session",
    tableName: "sessions",
    timestamps: true,
    underscored: true,
  }
);

TeamInformation.hasMany(Session, { foreignKey: "teamId", as: "sessionTeam" });
Session.belongsTo(TeamInformation, {
  foreignKey: "teamId",
  targetKey: "id",
  as: "team",
});

Session.belongsTo(UserInformation, {
  foreignKey: "scrumMasterId",
  targetKey: "id",
  as: "scrumMaster",
});

Estimations.hasMany(Session, { foreignKey: "estimationId" });
Session.belongsTo(Estimations, {
  foreignKey: "estimationId",
  targetKey: "id",
});

calculations.hasMany(Session, { foreignKey: "calculationId" });
Session.belongsTo(calculations, {
  foreignKey: "calculationId",
  targetKey: "id",
});

export default Session;
