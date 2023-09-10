import { DataTypes, Model, Sequelize } from 'sequelize';

export class Locations extends Model { }

export function initLocations(sequelize: Sequelize) {
    Locations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name: { type: DataTypes.STRING(128) },
        Image: { type: DataTypes.STRING(512) },
        Description: { type: DataTypes.STRING(512) },
        GenerationDescription: { type: DataTypes.STRING(2048) },
        IsDefault: { type: DataTypes.BOOLEAN },
        UserCreatedID: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        sequelize, modelName: 'locations', tableName: `locations`,
        timestamps: true
    });

    return Locations;
}
