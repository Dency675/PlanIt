import { Model } from "sequelize";

class Estimations extends Model {
  public id?: number;
  public estimationName!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

export default Estimations;
