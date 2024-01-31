import { DataTypes } from "sequelize";
import teamMemberInformation from "../../types/modelTypes/teamMemberInformation";
import teamInformation from "./teamInformation";
import userInformation from "./userInformation";
import sequelize from "../config/sequelize";
import roles from "./roles";

teamMemberInformation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_information",
        key: "id",
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "team_information",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "teamMemberInformation",
    tableName: "team_member_information",
    underscored:true,
  }
);

teamInformation.hasMany(teamMemberInformation, { foreignKey: "teamId" });
teamMemberInformation.belongsTo(teamInformation, {
    foreignKey: "teamId",
    targetKey: "id",
  });

  userInformation.hasMany(teamMemberInformation, { foreignKey: "userId" });
  teamMemberInformation.belongsTo(userInformation, {
    foreignKey: "userId",
    targetKey: "id",
  });

  roles.hasMany(teamMemberInformation, { foreignKey: "roleId" });
  teamMemberInformation.belongsTo(roles, {
    foreignKey: "roleId",
    targetKey: "id",
  });

export default teamMemberInformation;
