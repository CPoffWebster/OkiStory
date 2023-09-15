import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BooksAttributes {
    id: number;
    Title: string;
    CoverImage: string;
    LocationID: number;
    CharacterID: number;
    UserID: number;
}

export class Books extends Model<BooksAttributes> { }

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Title: { type: DataTypes.STRING(255) },
        CoverImage: { type: DataTypes.STRING(255) },
        LocationID: { type: DataTypes.INTEGER },
        CharacterID: { type: DataTypes.INTEGER },
        UserID: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}
