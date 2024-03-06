import { Model } from "sequelize";
class notification extends Model {
  public id!: number;
  public userId!: number;
  public context!: string;
  public prop?: string;
  public status!: boolean;
  public isRead!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export default notification;
