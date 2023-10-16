import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BooksAttributes {
    id: number;
    GUID: string;
    Title: string;
    GeneratedImageID: number;
    GeneratedTextID: number;
    LocationID: number;
    CharacterID: number;
    Theme: string;
    LongTheme: string;
    PageCount: number;
    UserID: number;
}

export class Books extends Model<BooksAttributes> { }

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        Title: { type: DataTypes.STRING(255) },
        GeneratedTextID: { type: DataTypes.INTEGER },
        GeneratedImageID: { type: DataTypes.INTEGER },
        LocationID: { type: DataTypes.INTEGER },
        CharacterID: { type: DataTypes.INTEGER },
        Theme: { type: DataTypes.STRING(255) },
        LongTheme: { type: DataTypes.TEXT },
        PageCount: { type: DataTypes.INTEGER },
        UserID: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}