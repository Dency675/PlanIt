import { Model } from 'sequelize';

class Scales extends Model{
    public id?: number;
    public estimationId!: number;
    public scaleName!: string;
    public scaleValue!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default Scales;