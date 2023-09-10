import { ReadingAlphaDB } from './ReadingAlphaDB';
import { Options, Sequelize } from 'sequelize';

/**
 * Gets a connection to the database
 */
export function connectToDb() {

    const { database, user, pass, settings } = getDbConfig();
    const sequelize = new Sequelize(database, user, pass, settings);

    return new ReadingAlphaDB(sequelize);
}

export function initializeTables() {
    const { database, user, pass, settings } = getDbConfig();
    const sequelize = new Sequelize(database, user, pass, settings);

    const db = new ReadingAlphaDB(sequelize);
    db.createTables({ useDev: true });
}

/**
 * Gets the database configuration
 */
export function getDbConfig(): ConnectionSetting {
    const { IS_CLOUD, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, CLOUD_SQL_CONNECTION_NAME, SQL_LOGGING } = process.env;

    console.log("LOOK HERE", IS_CLOUD, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, CLOUD_SQL_CONNECTION_NAME, SQL_LOGGING);

    const isCloud = (IS_CLOUD) ? JSON.parse(IS_CLOUD) : false;
    const sqlLogging = (SQL_LOGGING) ? JSON.parse(SQL_LOGGING) : false;
    if (!JSON.parse(isCloud) && DB_HOST && DB_USER && DB_PASSWORD && DB_NAME) {
        return connection(DB_NAME, DB_USER, DB_PASSWORD, {
            dialect: 'mysql',
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
            host: DB_HOST,
            pool: {
                max: 100,
                acquire: 10000  // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            },
            logging: JSON.parse(sqlLogging) || false,
        });
    }

    if (JSON.parse(isCloud)) {
        return connection('invoice', 'test-user', 'MyPasswordIsDumb21398234', {
            host: '127.0.0.1',
            dialect: 'mysql',
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        });
    }

    if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
        throw new Error(`Invalid database connection information`);
    }

    return connection(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        dialectOptions: {
            socketPath: `/cloudsql/${CLOUD_SQL_CONNECTION_NAME}`,
        }
    });
}

/**
 * Creates a database config object to create a Sequelize connection
 *
 * @param DB_NAME
 * @param DB_USER
 * @param DB_PASS
 * @param settings
 */
function connection(DB_NAME: string, DB_USER: string, DB_PASS: string, settings: Options) {
    return {
        database: DB_NAME,
        user: DB_USER,
        pass: DB_PASS,
        settings: settings
    };
}

type ConnectionSetting = ReturnType<typeof connection>;
