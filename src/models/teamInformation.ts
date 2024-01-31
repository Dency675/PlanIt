import { DataTypes } from "sequelize";
import teamInformation from "../../types/modelTypes/teamInformation";
import sequelize from "../config/sequelize";
 
teamInformation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        teamName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique:true,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
        },
    },
    {
        sequelize, 
        modelName: 'teamInformation', 
        tableName: 'team_information', 
        timestamps: true, 
        underscored: true
    }
);

export default teamInformation;
