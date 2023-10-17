import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BooksAttributes {
    id?: number;
    GUID: string;
    Title: string;
    GeneratedImageID: number;
    GeneratedTextID: number;
    LocationID: number;
    CharacterID: number;
    ThemeID: number;
    UserID: number;
    PageCount: number;
}

export class Books extends Model<BooksAttributes> {
    static async save(book: BooksAttributes) {
        const [books, created] = (await Books.findOrCreate({
            where: {
                GUID: book.GUID,
            },
            defaults: book
        }))
        return { books, created }
    }
}

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        Title: { type: DataTypes.STRING(255) },
        GeneratedTextID: { type: DataTypes.INTEGER },
        GeneratedImageID: { type: DataTypes.INTEGER },
        LocationID: { type: DataTypes.INTEGER },
        CharacterID: { type: DataTypes.INTEGER },
        ThemeID: { type: DataTypes.INTEGER },
        UserID: { type: DataTypes.INTEGER },
        PageCount: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}