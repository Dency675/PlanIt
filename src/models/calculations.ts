import { DataTypes, Sequelize } from "sequelize";
import calculations from "../../types/modelTypes/calculations";
import sequelize from "../config/sequelize";


calculations.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    calculationName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
},{
    sequelize,
    modelName:'calculations', 
    tableName:'calculations',
    underscored:true
});
export default calculations;


