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
import { seedDefaultCharacters, seedDefaultLocations } from './seedInstaller';


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

    /**
     * Update the database schema to match the models.
     * @param options if dev is false, the entire database will be dropped and recreated.  If dev is true, the database will be altered.
     */
    public async createTables(options: { useDev?: boolean } = {}) {
        // const syncOptions: SyncOptions = (options.useDev === true)
        //     ? ({ alter: true, force: true })  //  Force if dev
        //     : ({ alter: true, force: false });  // Don't force it.  We're in prod
        const syncOptions: SyncOptions = { alter: true, force: false };

        await this.tables.Users.sync(syncOptions)
        await this.tables.UserAccounts.sync(syncOptions)
        await this.tables.PaidAccounts.sync(syncOptions)
        await this.tables.Books.sync(syncOptions)
        await this.tables.Pages.sync(syncOptions)
        await this.tables.Characters.sync(syncOptions)
        await this.tables.Locations.sync(syncOptions)
        await this.tables.TextGenerations.sync(syncOptions)
        await this.tables.ImageGenerations.sync(syncOptions)

        await this.seedData();
    }

    /**
     * Seed the database with default data.
     */
    public async seedData() {
        console.info('Seeding data...')
        const transaction = await this.sequelize.transaction();

        try {
            await seedDefaultCharacters(transaction);
            await seedDefaultLocations(transaction);
            // Call other seeding functions like seedDefaultLocations(transaction);
            await transaction.commit();
            console.info('Seeding data complete.')
        } catch (error) {
            console.error(`Error seeding data: ${JSON.stringify(error)}`)
            await transaction.rollback();
            throw error;
        }
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