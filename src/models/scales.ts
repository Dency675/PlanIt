import { Sequelize,DataTypes } from 'sequelize';
import sequelize  from "../config/sequelize";
import Scales from '../../types/modelTypes/scales';  
import Estimations from './estimations';

Scales.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    estimationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estimations,
            key: 'id',
        },
    },
    scaleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    scaleValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
},
{
    sequelize,
    modelName:'scales',
    tableName:'scales',
    underscored: true,
});

Scales.belongsTo(Estimations, { foreignKey: 'estimation_id',
targetKey: "id" });
Estimations.hasMany(Scales, { foreignKey: 'estimation_id' });
 
export default Scales;
