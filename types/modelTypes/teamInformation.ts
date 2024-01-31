import { Model } from 'sequelize';
 
class teamInformation extends Model {
    public id!: number;
    public teamName!: string;
    public status!: 'active' | 'inactive';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  static teamName: any;
  static status: any;
  static id: any;
}

export default teamInformation;
