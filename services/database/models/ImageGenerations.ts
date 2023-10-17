import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ImageGenerationsAttributes {
    id?: number;
    Company: string;
    Model: string;
    Type: string;
    Input: string;
    APICallMilliSeconds?: number;
    EstimatedPrice?: number;
    GCSLocation?: string;
}

export class ImageGenerations extends Model<ImageGenerationsAttributes> {

    static async createGeneration(imageGeneration: ImageGenerationsAttributes) {
        const imageGenerationInstance = await ImageGenerations.create(imageGeneration);
        return imageGenerationInstance.get({ plain: true });
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
}

export function initImageGenerations(sequelize: Sequelize) {
    ImageGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        Type: { type: DataTypes.STRING(128), allowNull: false },
        Input: { type: DataTypes.TEXT, allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: true },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
    }, {
        sequelize, modelName: 'image_generations', tableName: `image_generations`,
        timestamps: true
    });

    return ImageGenerations;
}