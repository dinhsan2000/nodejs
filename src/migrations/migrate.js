// migrate.js

import yargs from 'yargs';
import Migration from './migration.js';
import {logger} from "../utils/index.js";

async function migrate() {
    try {
        const migration = new Migration();
        await migration.migrate();
    } catch (error) {
        throw new Error(error);
    }
}

migrate().then(r => console.log('Database migrated')).catch(e => console.error(e));
