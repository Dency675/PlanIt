import { DataTypes } from "sequelize";
import participantScores from "../../types/modelTypes/participantScores";
import sequelize from "../config/sequelize";

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

export default participantScores;
