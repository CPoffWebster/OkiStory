import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CharactersAttributes {
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

export class Characters extends Model<CharactersAttributes> {
    static async getCharacter(id: number) {
        return await Characters.findOne({ where: { id: id } });
    }

    static async getDefaultCharacters() {
        const characters = await Characters.findAll({
            where: {
                IsDefault: true
            }
        });

        return characters ? characters.map(character => {
            const char = character.get({ plain: true })
            char.createdAt = char.createdAt?.toString();
            char.updatedAt = char.updatedAt?.toString();
            return char;
        }) : null;
    }
}

export function initCharacters(sequelize: Sequelize) {
    Characters.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        Name: { type: DataTypes.STRING(128) },
        Description: { type: DataTypes.TEXT },
        GenerationDescription: { type: DataTypes.TEXT },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
        IsDefault: { type: DataTypes.BOOLEAN, allowNull: true },
        UserCreatedID: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        sequelize, modelName: 'characters', tableName: `characters`,
        timestamps: true
    });

    return Characters;
}
