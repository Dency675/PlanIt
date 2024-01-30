import { DataTypes, Sequelize } from "sequelize";
import calculations from "../../types/modelTypes/calculations";
import sequelize from "../config/sequelize";


calculations.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    calculation_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize,
    modelName:'calculations', 
    tableName:'calculations',
    underscored:true
});
export default calculations;


