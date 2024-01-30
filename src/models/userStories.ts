import { DataTypes } from "sequelize";
import userStories from "../../types/modelTypes/userStories";
import sequelize from "../config/sequelize";

userStories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },

    userStory: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user_stories",
    tableName: "user_stories",
    underscored: true,
  }
);

export default userStories;
