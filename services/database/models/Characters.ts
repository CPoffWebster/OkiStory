import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CharactersAttributes {
    id: number;
    Name: string;
    Image: string;
    Description: string;
    GenerationDescription: string;
    IsDefault: boolean;
    UserCreatedID?: number;
}

export class Characters extends Model<CharactersAttributes> { }

export function initCharacters(sequelize: Sequelize) {
    Characters.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name: { type: DataTypes.STRING(128) },
        Image: { type: DataTypes.STRING(255) },
        Description: { type: DataTypes.TEXT },
        GenerationDescription: { type: DataTypes.TEXT },
        IsDefault: { type: DataTypes.BOOLEAN },
        UserCreatedID: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        sequelize, modelName: 'characters', tableName: `characters`,
        timestamps: true
    });

    return Characters;
}
