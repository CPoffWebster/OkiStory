import { DataTypes, Model, Op, Sequelize, Transaction } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface BooksAttributes {
    id?: number;
    GUID: string;
    DefaultBook?: boolean;
    UserID: number;
    Title?: string;
    GeneratedImageID?: number;
    GeneratedTextID?: number;
    LocationGUID: string;
    CharacterGUID: string;
    ThemeGUID: string;
    StyleGUID: string;
    PageCount?: number;

    // Not in database
    imageGCSLocation?: string; // location of image from GeneratedImageID
    imageError?: boolean; // error from generating image\
    UserBookRating?: number; // rating from UserBookReviews
}

export class Books extends Model<BooksAttributes> {

    static async createBook(book: BooksAttributes, transaction: Transaction) {
        const newBook = await Books.create(book, { transaction });
        return serializeTableObject(newBook)
    }

    static async updateBook(book: BooksAttributes, transaction: Transaction) {
        await Books.update(
            book,
            {
                where: {
                    id: book.id
                },
                transaction: transaction
            }
        );
    }

    static async getBook(guid: string, transaction: Transaction) {
        const book = await Books.findOne({
            where: {
                GUID: guid
            },
            transaction: transaction
        });
        return book ? serializeTableObject(book) : null;
    }

    static async getUserBooks(userID: number, count: number, offset: number, transaction: Transaction): Promise<BooksAttributes[] | null> {
        const books = await Books.findAll({
            limit: count,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                UserID: userID,
            },
            transaction: transaction
        });

        return books ? books.map(book => serializeTableObject(book)) : null;
    }

    static async getDefaultBooks(count: number, offset: number, transaction: Transaction): Promise<BooksAttributes[] | null> {
        const books = await Books.findAll({
            limit: count,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                DefaultBook: true
            },
            transaction: transaction
        });
        return books ? books.map(book => serializeTableObject(book)) : null;
    }
}

export function initBooks(sequelize: Sequelize) {
    Books.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        GUID: { type: DataTypes.STRING(255) },
        DefaultBook: { type: DataTypes.BOOLEAN, defaultValue: false },
        UserID: { type: DataTypes.INTEGER },
        Title: { type: DataTypes.STRING(255) },
        GeneratedTextID: { type: DataTypes.INTEGER },
        GeneratedImageID: { type: DataTypes.INTEGER },
        LocationGUID: { type: DataTypes.STRING(255) },
        CharacterGUID: { type: DataTypes.STRING(255) },
        ThemeGUID: { type: DataTypes.STRING(255) },
        StyleGUID: { type: DataTypes.STRING(255) },
        PageCount: { type: DataTypes.INTEGER },
    }, {
        sequelize, modelName: 'books', tableName: `books`,
        timestamps: true
    });

    return Books;
}