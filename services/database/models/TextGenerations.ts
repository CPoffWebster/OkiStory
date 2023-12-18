import { DataTypes, Model, Sequelize, Transaction } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface TextGenerationsAttributes {
    id?: number;
    Company: string;
    Model: string;
    InputCharacters: number;
    OutputCharacters?: number;
    APICallMilliSeconds?: number;
    EstimatedPrice?: number;
    GCSLocation?: string;
}

export class TextGenerations extends Model<TextGenerationsAttributes> {

    static async createGeneration(textGeneration: TextGenerationsAttributes, transaction: Transaction) {
        const textGenerationInstance = await TextGenerations.create(textGeneration, { transaction });
        return serializeTableObject(textGenerationInstance);
    }

    static async updateGeneration(textGeneration: TextGenerationsAttributes) {
        await TextGenerations.update(
            textGeneration,
            {
                where: {
                    id: textGeneration.id
                }
            }
        );
    }
}

export function initTextGenerations(sequelize: Sequelize) {
    TextGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: true },
        InputCharacters: { type: DataTypes.INTEGER, allowNull: true },
        OutputCharacters: { type: DataTypes.INTEGER, allowNull: true },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
    }, {
        sequelize, modelName: 'text_generations', tableName: `text_generations`,
        timestamps: true
    });

    return TextGenerations;
}