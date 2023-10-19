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

    // Not in database
    imageGCSLocation?: any; // location of image from GeneratedImageID
}

export class Books extends Model<BooksAttributes> {

    static async createBook(book: BooksAttributes) {
        const newBook = await Books.create(book);
        return newBook.get({ plain: true });
    }

    static async updateBook(book: BooksAttributes) {
        await Books.update(
            book,
            {
                where: {
                    id: book.id
                }
            }
        );
    }

    static async getBook(guid: string) {
        const book = await Books.findOne({
            where: {
                GUID: guid
            }
        });
        return book ? book.get({ plain: true }) : null;
    }

    static async getUserBooks(userID: number, count: number, offset: number): Promise<BooksAttributes[] | null> {
        const books = await Books.findAll({
            limit: count,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                UserID: userID
            }
        });

        return books ? books.map(book => book.get({ plain: true })) : null;
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