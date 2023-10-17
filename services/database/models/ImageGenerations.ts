import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ImageGenerationsAttributes {
    id?: number;
    Company: string;
    Model: string;
    Type: string;
    APICallMilliSeconds: number;
    Input: string;
    EstimatedPrice: number;
    GCSLocation?: string;
}

export class ImageGenerations extends Model<ImageGenerationsAttributes> {

    /**
     * Saves the generated text to the database
     * @param guid 
     * @param model 
     * @param type 
     * @param seconds 
     * @param input 
     * @param generatedURL
     * @param gCSLocation 
     */
    static async saveOpenAIImageGeneration(model: string, type: string, seconds: number, input: string, gCSLocation: string) {
        let price = 0;
        switch (model) {
            case ('1024x1024'):
                price = .02;
                break;
            case ('512x512'):
                price = .018;
                break;
            case ('256x256'):
                price = .016;
                break;
        }

        await ImageGenerations.create({
            Company: 'OpenAI',
            Model: model,
            Type: type,
            APICallMilliSeconds: seconds,
            Input: input,
            GCSLocation: gCSLocation,
            EstimatedPrice: price
        });
    }
}

export function initImageGenerations(sequelize: Sequelize) {
    ImageGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        Type: { type: DataTypes.STRING(128), allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: true },
        Input: { type: DataTypes.TEXT, allowNull: false },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: true },
    }, {
        sequelize, modelName: 'image_generations', tableName: `image_generations`,
        timestamps: true
    });

    return ImageGenerations;
}