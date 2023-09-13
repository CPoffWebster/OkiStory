import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PagesAttributes {
    id: number;
    BookID: number;
    PageNumber: number;
    Text: string;
    Image: string;
    PositiveImagePrompt: string;
    NegativeImagePrompt: string;
}

export class Pages extends Model<PagesAttributes> { }

export function initPages(sequelize: Sequelize) {
    Pages.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        BookID: { type: DataTypes.INTEGER },
        PageNumber: { type: DataTypes.INTEGER },
        Text: { type: DataTypes.TEXT },
        Image: { type: DataTypes.STRING(512) },
        PositiveImagePrompt: { type: DataTypes.TEXT },
        NegativeImagePrompt: { type: DataTypes.TEXT },
    }, {
        sequelize, modelName: 'pages', tableName: `pages`,
        timestamps: true
    });

    return Pages;
}
