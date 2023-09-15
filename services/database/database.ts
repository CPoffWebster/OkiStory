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

export async function initializeTables() {
    const { database, user, pass, settings } = getDbConfig();
    console.log('HERE 1 Initializing tables', database, user, pass, settings)
    const sequelize = new Sequelize(database, user, pass, settings);

    const db = new ReadingAlphaDB(sequelize);

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((err) => {
            console.log('Unable to connect to the database:', err);
        });
    db.createTables({ useDev: true });
}

/**
 * Gets the database configuration
 */
export function getDbConfig(): ConnectionSetting {
    const { IS_CLOUD, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, CLOUD_SQL_CONNECTION_NAME, SQL_LOGGING } = process.env;

    const isCloud = (IS_CLOUD) ? JSON.parse(IS_CLOUD) : false;
    const sqlLogging = (SQL_LOGGING) ? JSON.parse(SQL_LOGGING) : false;
    console.log('HERE 2 getDbConfig')
    if (!JSON.parse(isCloud) && DB_HOST && DB_USER && DB_PASSWORD && DB_NAME) {
        console.log('HERE 3 getDbConfig')
        return connection(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: 3306,
            dialect: 'mysql',
            define: {
                // charset: 'utf8',
                // collate: 'utf8_general_ci',
            },
            dialectOptions: {
                socketPath: `${CLOUD_SQL_CONNECTION_NAME}`,
            },
            pool: {
                max: 100,
                min: 0,
                acquire: 10000,  // The maximum time, in milliseconds, that pool will try to get connection before throwing error
                idle: 10000,     // The maximum time, in milliseconds, that a connection can be idle before being released
            },
            logging: JSON.parse(sqlLogging) || false,
        });
    }

    console.log('HERE 4 getDbConfig')
    if (!CLOUD_SQL_CONNECTION_NAME || !DB_USER || !DB_PASSWORD || !DB_NAME) {
        console.log('HERE 5 getDbConfig')
        throw new Error(`Invalid database connection information`);
    }

    console.log('HERE 6 getDbConfig')
    return connection(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        dialectOptions: {
            socketPath: `${CLOUD_SQL_CONNECTION_NAME}`,
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
