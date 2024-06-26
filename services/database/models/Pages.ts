import { DataTypes, Model, Sequelize, Transaction } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface PagesAttributes {
    id?: number;
    BookID: number;
    PageNumber: number;
    GeneratedImageID: number;
    Text: string;

    // Not in database
    imageGCSLocation?: string; // location of image from GeneratedImageID
    imageError?: boolean; // error from generating image
}

export class Pages extends Model<PagesAttributes> {
    static async save(page: PagesAttributes, transaction: Transaction) {
        const [pages, created] = (await Pages.findOrCreate({
            where: {
                BookID: page.BookID,
                PageNumber: page.PageNumber
            },
            transaction: transaction,
            defaults: page
        }))
        return { pages, created }
    }

    static async getBookPages(bookID: number, transaction: Transaction): Promise<PagesAttributes[] | null> {
        const pages = await Pages.findAll({
            where: {
                BookID: bookID
            },
            transaction: transaction
        });

        return pages ? pages.map(page => serializeTableObject(page)) : null;
    }
}

export function initPages(sequelize: Sequelize) {
    Pages.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        BookID: { type: DataTypes.INTEGER },
        PageNumber: { type: DataTypes.INTEGER },
        GeneratedImageID: { type: DataTypes.INTEGER },
        Text: { type: DataTypes.TEXT }
    }, {
        sequelize, modelName: 'pages', tableName: `pages`,
        timestamps: true
    });

    return Pages;
}
