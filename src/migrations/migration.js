import Database from '../models/database.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/index.js';
import dotenv from 'dotenv';

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
      const [checkTable] = await this.pool.query(`SHOW TABLES LIKE 'migrations'`);

      // if the table migrations does not exist, create it
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
            logger('info', `Migrated: ${file}`);
            // Insert the migration into the migrations table
            await this.pool.query(`INSERT INTO migrations SET ?`, { name: file });
          } else {
            logger('info', `Skipped: ${file}`);
          }
        }
      }
      logger('info', 'Database migration completed successfully.');
    } catch (error) {
      logger('error', 'Database migration failed:' + error);
      throw new Error('Database migration failed');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }
}
