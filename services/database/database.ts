import { ReadingAlphaDB } from './ReadingAlphaDB';
import { Options, Sequelize } from 'sequelize';

/**
 * Gets a connection to the database
 */
export function connectToDb() {

    const { database, user, pass, settings } = getDbConfig();
    const sequelize = new Sequelize(database, user, pass, settings);

    sequelize
        .authenticate()
        .then(() => {
            console.log('Database connection has been established successfully.');
        })
        .catch((err) => {
            console.log('Unable to connect to the database:', err);
        });

    return new ReadingAlphaDB(sequelize);
}

/**
 * Gets the database configuration
 */
export function getDbConfig(): ConnectionSetting {
    const { IS_CLOUD, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, CLOUD_SQL_CONNECTION_NAME, SQL_LOGGING } = process.env;

    const isCloud = (IS_CLOUD) ? JSON.parse(IS_CLOUD) : false;
    const sqlLogging = (SQL_LOGGING) ? JSON.parse(SQL_LOGGING) : false;


    if (isCloud && DB_HOST && DB_NAME && DB_USER && DB_PASSWORD) {
        return connection(DB_NAME, DB_USER, DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: true,
                }
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

    if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
        throw new Error(`Invalid database connection information`);
    }

    return connection(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
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
