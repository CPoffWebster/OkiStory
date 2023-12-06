import { DataTypes, Model, Sequelize } from 'sequelize';
import { serializeTableObject } from '../modelSerialize';

export interface PagesAttributes {
    id?: number;
    BookID: number;
    PageNumber: number;
    GeneratedImageID: number;
    Text: string;
}

export class Pages extends Model<PagesAttributes> {
    static async save(page: PagesAttributes) {
        const [pages, created] = (await Pages.findOrCreate({
            where: {
                BookID: page.BookID,
                PageNumber: page.PageNumber
            },
            defaults: page
        }))
        return { pages, created }
    }

    static async getBookPages(bookID: number): Promise<PagesAttributes[] | null> {
        const pages = await Pages.findAll({
            where: {
                BookID: bookID
            }
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
