import { Model } from "sequelize";

class EmployeeRoleMapping extends Model {
  [x: string]: any;
  public id!: number;
  public userId!: string;
  public roleId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
export default EmployeeRoleMapping;
