import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import EmployeeRoleMapping from "../../types/modelTypes/employeeRoleMapping";
import UserInformation from "./userInformation";
import Role from "./roles";

EmployeeRoleMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  },
  {
    modelName: "employeeRoleMapping",
    tableName: "employee_role_mapping",
    underscored: true,
    sequelize,
  }
);

UserInformation.belongsToMany(Role, {
  through: EmployeeRoleMapping,
  foreignKey: "userId",
});
Role.belongsToMany(UserInformation, {
  through: EmployeeRoleMapping,
  foreignKey: "roleId",
  as: "role",
});

// EmployeeRoleMapping.hasMany(Role, {
//   foreignKey: "roleId",
//   as: "role",
// });

export default EmployeeRoleMapping;
