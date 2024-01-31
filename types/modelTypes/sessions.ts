import { Model } from "sequelize";

class Session extends Model {
  [x: string]: any;
  public id!: number;
  public sessionTitle!: string;
  public createDateTime!: Date;
  public timer!: string | null;
  public excelLink!: string;
  public teamId!: number;
  public scrumMasterId!: string;
  public estimationId!: number;
  public calculationId!: number;
  public status!: "active" | "completed";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default Session;
