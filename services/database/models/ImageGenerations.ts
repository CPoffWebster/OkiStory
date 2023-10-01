import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ImageGenerationsAttributes {
    id?: number;
    GUID: string;
    Company: string;
    Model: string;
    Type: string;
    APICallMilliSeconds: number;
    Input: string;
    GeneratedURL: string;
    GCSLocation: string;
    EstimatedPrice: number;
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
    static async saveOpenAIImageGeneration(guid: string, model: string, type: string, seconds: number, input: string, generatedURL: string, gCSLocation: string) {
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
            GUID: guid,
            Company: 'OpenAI',
            Model: model,
            Type: type,
            APICallMilliSeconds: seconds,
            Input: input,
            GeneratedURL: generatedURL,
            GCSLocation: gCSLocation,
            EstimatedPrice: price
        });
    }
}

export function initImageGenerations(sequelize: Sequelize) {
    ImageGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.UUID, allowNull: false },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        Type: { type: DataTypes.STRING(128), allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: false },
        Input: { type: DataTypes.TEXT, allowNull: false },
        GeneratedURL: { type: DataTypes.TEXT, allowNull: false },
        GCSLocation: { type: DataTypes.STRING(256), allowNull: false },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: false }
    }, {
        sequelize, modelName: 'image_generations', tableName: `image_generations`,
        timestamps: true
    });

    return ImageGenerations;
}