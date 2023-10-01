import { QueryTypes, QueryOptionsWithType, Sequelize, SyncOptions } from 'sequelize';
import { initUsers } from './models/Users';
import { initUserAccounts } from './models/UserAccounts';
import { initPaidAccounts } from './models/PaidAccounts';
import { initBooks } from './models/Books';
import { initPages } from './models/Pages';
import { initCharacters } from './models/Characters';
import { initLocations } from './models/Locations';
import { initTextGenerations } from './models/TextGenerations';
import { initImageGenerations } from './models/ImageGenerations';


type ReadingAlphaTables = ReturnType<typeof initializeTables>;

export class ReadingAlphaDB {
    public readonly tables: ReadingAlphaTables;

    constructor(private sequelize: Sequelize) {
        this.tables = initializeTables(sequelize);
    }
    public connected = true;
    query(sql: string, bind?: Record<string, string | number | boolean | Date | null> | null, replacements?: Record<string, unknown>) {
        const options: QueryOptionsWithType<QueryTypes.SELECT> = { type: QueryTypes.SELECT };

        if (bind) {
            options.bind = bind;
        }
        if (replacements) {
            options.replacements = replacements;
        }
        return this.sequelize.query(sql, options);
    }

    insert(sql: string, bind?: Record<string, string | number | boolean | Date | null> | null, replacements?: Record<string, unknown>) {
        const options: QueryOptionsWithType<QueryTypes.INSERT> = { type: QueryTypes.INSERT };

        if (bind) {
            options.bind = bind;
        }
        if (replacements) {
            options.replacements = replacements;
        }
        return this.sequelize.query(sql, options);
    }

    update(sql: string, bind?: Record<string, string | number | boolean | Date | null> | null, replacements?: Record<string, unknown>) {
        const options: QueryOptionsWithType<QueryTypes.UPDATE> = { type: QueryTypes.UPDATE };

        if (bind) {
            options.bind = bind;
        }
        if (replacements) {
            options.replacements = replacements;
        }
        return this.sequelize.query(sql, options);
    }

    delete(sql: string, bind?: Record<string, string | number | boolean | Date | null> | null, replacements?: Record<string, unknown>) {
        const options: QueryOptionsWithType<QueryTypes.DELETE> = { type: QueryTypes.DELETE };

        if (bind) {
            options.bind = bind;
        }
        if (replacements) {
            options.replacements = replacements;
        }
        return this.sequelize.query(sql, options);
    }

    transaction() {
        return this.sequelize.transaction();
    }

    // public async recreateDatabase() {
    //     await this.sequelize.dropAllSchemas({});
    //     // await this.createTables();
    // }

    public async createTables(options: { useDev?: boolean } = {}) {
        const syncOptions: SyncOptions = (options.useDev === true)
            ? ({ alter: true, force: true })  //  Force if dev
            : ({ alter: true, force: false });  // Don't force it.  We're in prod

        await this.tables.Users.sync(syncOptions)
        await this.tables.UserAccounts.sync(syncOptions)
        await this.tables.PaidAccounts.sync(syncOptions)
        await this.tables.Books.sync(syncOptions)
        await this.tables.Pages.sync(syncOptions)
        await this.tables.Characters.sync(syncOptions)
        await this.tables.Locations.sync(syncOptions)
        await this.tables.TextGenerations.sync(syncOptions)
        await this.tables.ImageGenerations.sync(syncOptions)
    }
}

function initializeTables(sequelize: Sequelize) {
    const tables = {
        Users: initUsers(sequelize),
        UserAccounts: initUserAccounts(sequelize),
        PaidAccounts: initPaidAccounts(sequelize),
        Books: initBooks(sequelize),
        Pages: initPages(sequelize),
        Characters: initCharacters(sequelize),
        Locations: initLocations(sequelize),
        TextGenerations: initTextGenerations(sequelize),
        ImageGenerations: initImageGenerations(sequelize),
    }
    return tables;
}