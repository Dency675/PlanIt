import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import Session from "./sessions";
import UserInformation from "./userInformation";
import SessionParticipants from "../../types/modelTypes/sessionParticipants";
import Role from "./roles";

SessionParticipants.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Session,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserInformation,
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    isJoined: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: Sequelize.literal("false"),
    },
  },
  {
    sequelize,
    modelName: "SessionParticipants",
    underscored: true,
  }
);

SessionParticipants.belongsTo(Session, {
  foreignKey: "sessionId",
  targetKey: "id",
});
Session.hasMany(SessionParticipants, {
  foreignKey: "sessionId",
  as: "participants",
});

SessionParticipants.belongsTo(UserInformation, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});
UserInformation.hasMany(SessionParticipants, { foreignKey: "userId" });

SessionParticipants.belongsTo(Role, {
  foreignKey: "roleId",
  targetKey: "id",
  as: "role",
});
Role.hasMany(SessionParticipants, { foreignKey: "roleId" });

export default SessionParticipants;
