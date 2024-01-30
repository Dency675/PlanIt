import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/sequelize.ts";
import NoteInformation from "../../types/modelTypes/noteInformation.ts";

NoteInformation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    noteTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "noteInformation",
    tableName: "note_information",
    underscored: true,
  }
);

export default NoteInformation;
