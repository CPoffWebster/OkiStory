import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TextGenerationsAttributes {
    id?: number;
    GUID: string;
    Company: string;
    Model: string;
    APICallMilliSeconds: number;
    InputCharacters: number;
    OutputCharacters: number;
    EstimatedPrice: number;
}

export class TextGenerations extends Model<TextGenerationsAttributes> {

    /**
     * Save a record of text generation to the database
     * @param inputCharacters 
     * @param outputCharacters 
     * @param seconds time it took to generate the text
     * @param model 
     */
    static async saveOpenAITextGeneration(guid: string, inputCharacters: number, outputCharacters: number, seconds: number, model: string) {
        let inputPrice = 0;
        let outputPrice = 0;
        switch (model) {
            case 'gpt-3.5-turbo':
                inputPrice = 0.0000015;
                outputPrice = 0.000002;
                break;
            case 'GPT-4':
                inputPrice = 0.00003;
                outputPrice = 0.00006;
                break;
        }
        await TextGenerations.create({
            Company: 'OpenAI',
            GUID: guid,
            Model: model,
            APICallMilliSeconds: seconds,
            InputCharacters: inputCharacters,
            OutputCharacters: outputCharacters,
            EstimatedPrice: (inputCharacters * inputPrice) + (outputCharacters * outputPrice)
        });
    }
}

export function initTextGenerations(sequelize: Sequelize) {
    TextGenerations.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.UUID, allowNull: false },
        Company: { type: DataTypes.STRING(128), allowNull: false },
        Model: { type: DataTypes.STRING(128), allowNull: false },
        APICallMilliSeconds: { type: DataTypes.INTEGER, allowNull: false },
        InputCharacters: { type: DataTypes.INTEGER, allowNull: false },
        OutputCharacters: { type: DataTypes.INTEGER, allowNull: false },
        EstimatedPrice: { type: DataTypes.DECIMAL(10, 8), allowNull: false }
    }, {
        sequelize, modelName: 'text_generations', tableName: `text_generations`,
        timestamps: true
    });

    return TextGenerations;
}