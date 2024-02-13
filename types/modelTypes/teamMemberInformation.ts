import { Model } from 'sequelize';

class teamMemberInformation extends Model {
    [x: string]: any;
    public id!: number;
    public userId!: string;
    public teamId!: number;
    public roleId!: number;
    public status!: 'active' | 'inactive';
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  export default teamMemberInformation;