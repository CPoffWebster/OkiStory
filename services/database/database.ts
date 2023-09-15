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
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SQL_LOGGING } = process.env;

    const sqlLogging = (SQL_LOGGING) ? JSON.parse(SQL_LOGGING) : false;
    if (DB_HOST && DB_USER && DB_PASSWORD && DB_NAME) {
        return connection(DB_NAME, DB_USER, DB_PASSWORD, {
            dialect: 'mysql',
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
            // host: DB_HOST,
            host: '/cloudsql/reading-alpha-dev:us-central1:reading-alpha-dev-sql-instance',
            dialectOptions: {
                socketPath: '/cloudsql/reading-alpha-dev:us-central1:reading-alpha-dev-sql-instance'
            },
            pool: {
                max: 100,
                acquire: 10000  // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            },
            logging: JSON.parse(sqlLogging) || false,
        });
    }

    throw new Error(`Invalid database connection information`);
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
