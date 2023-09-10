import { DataTypes, Model, Sequelize } from 'sequelize';

export class Books extends Model { }

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Title: { type: DataTypes.STRING(1024) },
        CoverImage: { type: DataTypes.STRING(512) },
        LocationID: { type: DataTypes.INTEGER },
        CharacterID: { type: DataTypes.INTEGER },
        UserID: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}
