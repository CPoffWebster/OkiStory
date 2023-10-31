import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface BooksAttributes {
    id?: number;
    GUID: string;
    Title?: string;
    GeneratedImageID?: number;
    GeneratedTextID?: number;
    LocationGUID: string;
    CharacterGUID: string;
    ThemeGUID: string;
    StyleGUID: string;
    UserEmail: string;
    PageCount?: number;

    // Not in database
    imageGCSLocation?: string; // location of image from GeneratedImageID
}

export class Books extends Model<BooksAttributes> {

    static async createBook(book: BooksAttributes) {
        const newBook = await Books.create(book);
        return serializeTableObject(newBook)
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
        return book ? serializeTableObject(book) : null;
    }

    static async getUserBooks(userEmail: string, count: number, offset: number): Promise<BooksAttributes[] | null> {
        const books = await Books.findAll({
            limit: count,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                UserEmail: userEmail
            }
        });

        return books ? books.map(book => serializeTableObject(book)) : null;
    }

    static async totalUserBooks(userEmail: string) {
        const totalBooks = await Books.count({
            where: {
                UserEmail: userEmail
            }
        });
        return totalBooks;
    }
}

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        Title: { type: DataTypes.STRING(255) },
        GeneratedTextID: { type: DataTypes.INTEGER },
        GeneratedImageID: { type: DataTypes.INTEGER },
        LocationGUID: { type: DataTypes.STRING(255) },
        CharacterGUID: { type: DataTypes.STRING(255) },
        ThemeGUID: { type: DataTypes.STRING(255) },
        StyleGUID: { type: DataTypes.STRING(255) },
        UserEmail: { type: DataTypes.STRING(255) },
        PageCount: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}