import { createConnection, Connection } from 'typeorm';

import * as entities from 'entities';
import Configuration from 'configuration';

const createDatabaseConnection = (): Promise<Connection> =>
    createConnection({
        type: 'postgres',
        host: Configuration.DB_HOST,
        port: Number(Configuration.DB_PORT),
        username: Configuration.DB_USERNAME,
        password: Configuration.DB_PASSWORD,
        database: Configuration.DB_DATABASE,
        entities: Object.values(entities),
        synchronize: true,
        ssl: {
            rejectUnauthorized: false,
        },
    });

export default createDatabaseConnection;
