import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface ImageGenerationsAttributes {
    id?: number;
    Company: string;
    Model: string;
    Size: string;
    Type: string;
    Input: string;
    APICallMilliSeconds?: number;
    EstimatedPrice?: number;
    GCSLocation?: string;
    Error?: string;
}

export class ImageGenerations extends Model<ImageGenerationsAttributes> {

    static async createGeneration(imageGeneration: ImageGenerationsAttributes) {
        const imageGenerationInstance = await ImageGenerations.create(imageGeneration);
        return serializeTableObject(imageGenerationInstance);
    }

    static async updateGeneration(imageGeneration: ImageGenerationsAttributes) {
        await ImageGenerations.update(
            imageGeneration,
            {
                where: {
                    id: imageGeneration.id
                }
            }
        );
    }

    static async getGeneration(id: number): Promise<ImageGenerationsAttributes | null> {
        const imageGeneration = await ImageGenerations.findByPk(id);
        return imageGeneration ? serializeTableObject(imageGeneration) : null;
    }
}

export function initImageGenerations(sequelize: Sequelize) {
    ImageGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        Size: { type: DataTypes.STRING(128), allowNull: false },
        Type: { type: DataTypes.STRING(128), allowNull: false },
        Input: { type: DataTypes.TEXT, allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: true },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
        Error: { type: DataTypes.TEXT, allowNull: true },
    }, {
        sequelize, modelName: 'image_generations', tableName: `image_generations`,
        timestamps: true
    });

    return ImageGenerations;
}