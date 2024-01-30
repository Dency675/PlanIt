import { Model } from 'sequelize';
 
class calculations extends Model {
    public id!: number;
    public calculationName!: string;
    public createdAt?: Date;
    public updatedAt?: Date;
};
 
export default calculations;