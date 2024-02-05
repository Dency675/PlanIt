import { DataTypes } from "sequelize";
import userStorySessionMapping from "../../types/modelTypes/userStorySessionMapping";
import sequelize from "../config/sequelize";
import userStories from "./userStories";
import Session from "./sessions";

userStorySessionMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },

    userStoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roundNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storyPointResult: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "user_story_session_mapping",
    tableName: "user_story_session_mapping",
    underscored: true,
  }
);

userStories.hasMany(userStorySessionMapping, {
  foreignKey: "userStoryId",
});
userStorySessionMapping.belongsTo(userStories, {
  foreignKey: "userStoryId",
  targetKey: "id",
  as: "userStory",
});

Session.hasMany(userStorySessionMapping, {
  foreignKey: "sessionId",
});
userStorySessionMapping.belongsTo(Session, {
  foreignKey: "sessionId",
  targetKey: "id",
});

export default userStorySessionMapping;
