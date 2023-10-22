import { DataTypes, Model, Sequelize } from 'sequelize';

export interface LocationsAttributes {
    id: number;
    GUID: string;
    Name: string;
    Description: string;
    GenerationDescription: string;
    GCSLocation?: string;
    IsDefault?: boolean;
    UserCreatedID?: number;
}

export class Locations extends Model<LocationsAttributes> { }

export function initLocations(sequelize: Sequelize) {
    Locations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        Name: { type: DataTypes.STRING(128) },
        Description: { type: DataTypes.TEXT },
        GenerationDescription: { type: DataTypes.TEXT },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
        IsDefault: { type: DataTypes.BOOLEAN, allowNull: true },
        UserCreatedID: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        sequelize, modelName: 'locations', tableName: `locations`,
        timestamps: true
    });

    return Locations;
}
