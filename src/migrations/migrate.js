// migrate.js

import Migration from './migration.js';

async function run() {
    const command = process.argv[2];
    switch (command) {
        case 'migrate':
            await migrate();
            break;
        case 'rollback':
            await rollback();
            break;
        case 'make':
            await make();
            break;
        default:
            console.log('Invalid command');
            break;
    }
}

async function migrate() {
    try {
        const migration = new Migration();
        await migration.migrate();
    } catch (error) {
        throw new Error(error);
    }
}

async function rollback() {
    try {
        const migration = new Migration();
        await migration.rollback();
    } catch (error) {
        throw new Error(error);
    }
}

async function make() {
    try {
        const name = process.argv[3];
        console.error(name);
        const migration = new Migration();
        await migration.makeMigration(name);
    } catch (error) {
        throw new Error(error);
    }
} 

run();