import { Model } from 'sequelize';
 
class calculations extends Model {
    public id!: number;
    public calculation_name!: string;
};
 
export default calculations;