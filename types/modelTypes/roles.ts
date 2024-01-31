import { Model } from "sequelize";

export class roles extends Model {
  public id!: number;
  public roleName!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}
