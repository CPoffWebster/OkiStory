import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PagesAttributes {
    id: number;
    GUID: string;
    BookID: number;
    PageNumber: number;
    Text: string;
    Image: string;
    PositiveImagePrompt: string;
    NegativeImagePrompt: string;
    LastPage?: boolean;
}

export class Pages extends Model<PagesAttributes> { }

export function initPages(sequelize: Sequelize) {
    Pages.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        BookID: { type: DataTypes.INTEGER },
        PageNumber: { type: DataTypes.INTEGER },
        Text: { type: DataTypes.TEXT },
        Image: { type: DataTypes.STRING(255) },
        PositiveImagePrompt: { type: DataTypes.TEXT },
        NegativeImagePrompt: { type: DataTypes.TEXT },
        LastPage: { type: DataTypes.BOOLEAN, allowNull: true },
    }, {
        sequelize, modelName: 'pages', tableName: `pages`,
        timestamps: true
    });

    return Pages;
}
