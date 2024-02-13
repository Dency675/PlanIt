import { DataTypes } from "sequelize";
import participantScores from "../../types/modelTypes/participantScores";
import sequelize from "../config/sequelize";
import teamInformation from "./teamInformation";
import userStorySessionMapping from "./userStorySessionMapping";
import teamMemberInformation from "./teamMemberInformation";

participantScores.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },

    teamMemberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userStorySessionMappingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storyPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "participant_scores",
    tableName: "participant_scores",
    underscored: true,
  }
);
teamMemberInformation.hasMany(participantScores, {
  foreignKey: "teamMemberId",
  as: "sessionParticipant",
});

participantScores.belongsTo(teamMemberInformation, {
  foreignKey: "teamMemberId",
  targetKey: "id",
});

userStorySessionMapping.hasMany(participantScores, {
  foreignKey: "userStorySessionMappingId",
  as: "participantScores",
});
participantScores.belongsTo(userStorySessionMapping, {
  foreignKey: "userStorySessionMappingId",
  targetKey: "id",
});

export default participantScores;
