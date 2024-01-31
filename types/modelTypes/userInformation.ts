import { Model, DataTypes } from "sequelize";

class userInformation extends Model {
  public id!: string;
  public employeeId!: string;
  public givenName!: string;
  public surName!: string;
  public email!: string;
  public department!: string;
  public jobTitle!: string;
  public joinDate!: Date;
  public lastLoginTime!: Date | null;
  public status!: "active" | "inactive" | "pending";
}
export default userInformation;
