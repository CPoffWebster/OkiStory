import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface LocationsAttributes {
    id?: number;
    GUID: string;
    Name: string;
    Description: string;
    GenerationDescription: string;
    GCSLocation?: string;
    IsDefault?: boolean;
    UserCreatedID?: number;

    // timestamps
    createdAt?: string;
    updatedAt?: string;
}

export class Locations extends Model<LocationsAttributes> {

    static async getLocation(guid: string) {
        const location = await Locations.findOne({ where: { GUID: guid } });
        return location ? serializeTableObject(location) : null;
    }

    static async getDefaultLocations() {
        const locations = await Locations.findAll({
            where: {
                IsDefault: true
            }
        });

        return locations ? locations.map(location => serializeTableObject(location)) : null;
    }
}

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
