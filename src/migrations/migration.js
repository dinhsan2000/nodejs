import Database from '../models/database.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/index.js';
import dotenv from 'dotenv';
import { table } from 'console';

export default class Migration extends Database {
  constructor() {
    super();
    this.init();
  }

  async init() {
    this.pool = this.connection();
  }

  async migrate() {
    dotenv.config();
    try {
      // Read all the files in the migrations folder
      const files = fs.readdirSync(path.resolve('src/migrations'));

      // Check if the migrations table exists
      await this.checkMigrationTable();

      // Loop through all the files
      for (const file of files) {
        // Skip the file if it is not a .sql file
        if (!file.endsWith('.sql')) {
          continue;
        }

        // Check if the file is a .sql file
        if (file.endsWith('.sql')) {
          // Check if the migration has already been run
          const [rows] = await this.pool.query(
            `SELECT * FROM migrations WHERE name = ?`,
            [file],
          );
          // If the migration has not been run, run it
          if (rows.length === 0) {
            // Read the contents of the file
            const contents = fs.readFileSync(
              path.resolve('src/migrations', file),
              'utf-8',
            );
            // Execute the SQL query
            await this.pool.query(contents);
            // Log the migration
            console.log('\x1b[32m', 'Migrated: ', file);
            // Insert the migration into the migrations table
            await this.pool.query(`INSERT INTO migrations SET ?`, { name: file });
          } else {
            console.log('\x1b[32m', 'Skipped:', file);
          }
        }
      }
    } catch (error) {
      logger('error', 'Database migration failed:' + error);
      throw new Error('Database migration failed');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async rollback() {
    try {
      // Check if the migrations table exists
      this.checkMigrationTable();

      // Get the last migration that was run
      const [lastMigration] = await this.pool.query(
        `SELECT * FROM migrations ORDER BY id DESC LIMIT 1`,
      );

      // If there are no migrations to rollback, return
      if (lastMigration.length === 0) {
        console.log('No migrations to rollback');
        return;
      }

      // Read the contents of the last migration that was run
      const contents = fs.readFileSync(
        path.resolve('src/migrations', lastMigration[0].name),
        'utf-8',
      );

      // Split the contents of the file by the semicolon
      const queries = contents.split(';');

      // Remove the last element of the array
      queries.pop();

      // Get name table
      const nameTable = lastMigration[0].name.split('-')[1].split('_table')[0].split('.')[0];

      // Loop through all the queries
      for (const query of queries) {
        // Execute the SQL query
        await this.pool.query(query);
      }

      // Drop the table
      await this.pool.query(`DROP TABLE IF EXISTS ${nameTable}`);

      // Log the rollback
      console.log('\x1b[32m', 'Rolled back:', lastMigration[0].name);

      // Delete the last migration from the migrations table
      await this.pool.query(`DELETE FROM migrations WHERE id = ?`, [
        lastMigration[0].id,
      ]);
    } catch (error) {
      logger('error', 'Database rollback failed:' + error);
      throw new Error('Database rollback failed');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  makeMigration(name) {
    const timestamp = new Date().getTime();
    fs.copyFileSync(
      path.resolve('src/migrations/template/template.sql'),
      path.resolve('src/migrations', `${timestamp}-${name}_table.sql`),
    );
    console.log('\x1b[32m', 'Created migration:', `${timestamp}-${name}_table.sql`);
  }

  async checkMigrationTable() {
    try {
      const [checkTable] = await this.pool.query(`SHOW TABLES LIKE 'migrations'`);
      if (checkTable.length === 0) {
        await this.pool.query(
          `CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`,
        );
      }
    } catch (error) {
      logger('error', 'Database migration table check failed:' + error);
      throw new Error('Database migration table check failed');
    }
  }
}
