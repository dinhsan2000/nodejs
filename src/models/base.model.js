import mysql from 'mysql2/promise';
import { logger } from '../utils/index.js';
import Database from './database.js';

export class BaseModel extends Database {
  table = '';
  hidden = [];

  constructor() {
    super();
    try {
      this.pool = this.connection();
    } catch (error) {
      logger('error', error);
      throw new Error('Error initializing database');
    }
  }

  /**
   * Get all data from the table or with a condition if set
   *
   * @returns {Promise<Array>} Data from the table
   * @throws {Error} If there's an error fetching data
   * @finally Close the connection
   * 
   */
  async get() {
    if (!this.sql || this.sql === '') {
      this.sql = `SELECT * FROM ${this.table}`;
    }

    try {
      const [rows] = await this.pool.query(this.sql);

      return this.deleteHiddenFields(rows);
    } catch (error) {
      logger('error', error);
      throw new Error('Error fetching data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  /**
   * Find data by ID in the table
   *
   * @param {number} id ID of the data
   * @returns {Promise<Object>} Data from the table
   * @throws {Error} If there's an error fetching data
   * @finally Close the connection
   * 
   */
  async find(id) {
    try {
      const [row] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id],
      );
      return this.deleteHiddenFields(row);
    } catch (error) {
      logger('error', error);
      throw new Error('Error fetching data');
    } // Don't close the connection here
  }

  /**
   * Find data by a condition in the table
   *
   * @param {Object} condition Condition to find data
   * @returns {Promise<Array>} Data from the table
   * @throws {Error} If there's an error fetching data
   * @finally Close the connection
   * 
   */
  where(condition) {
    let sql = `SELECT * FROM ${this.table} WHERE `;
    const keys = Object.keys(condition);
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        sql += `${key} = '${condition[key]}'`;
      } else {
        sql += `${key} = '${condition[key]}' AND `;
      }
    });

    this.sql = sql;
    return this;
  }

  /**
   * Find data where a field is not null in the table 
   *
   * @param {string} field Field to check if it's not null
   * @returns {Promise<Array>} Data from the table
   * @throws {Error} If there's an error fetching data
   * @finally Close the connection
   * 
   */
  whereNotNull(field) {
    this.sql = `SELECT * FROM ${this.table} WHERE ${field} IS NOT NULL`;
    return this;
  }

  /**
   * Select fields to fetch from the table 
   * 
   * @param  {...string} fields Fields to fetch
   * @returns {Promise<Array>} Data from the table
   * @throws {Error} If there's an error fetching data
   * @finally Close the connection
   * 
   */
  async select(...fields) {
    this.sql = `SELECT ${fields.join(', ')} FROM ${this.table}`;
    return this;
  }

  /**
   * Create data in the table 
   * 
   * @param {Object} data Data to create
   * @returns {Promise<Object>} Created data
   * @throws {Error} If there's an error creating data
   * @finally Close the connection
   * 
   */
  async create(data) {
    try {
      const [rows] = await this.pool.query(`INSERT INTO ${this.table} SET ?`, data);
      return await this.find(rows.insertId);
    } catch (error) {
      logger('error', error);
      throw new Error('Error creating data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  /**
   * Update data in the table
   * 
   * @param {number} id ID of the data
   * @param {Object} data Data to update
   * @returns {Promise<Object>} Updated data
   * @throws {Error} If there's an error updating data
   * @finally Close the connection
   * 
   */
  async update(id, data) {
    try {
      await this.pool.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [data, id]);
      return await this.find(id);
    } catch (error) {
      logger('error', error);
      throw new Error('Error updating data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  /**
   * Delete data from the table
   * 
   * @param {number} id ID of the data
   * @returns {Promise<void>}
   * @throws {Error} If there's an error deleting data
   * @finally Close the connection
   * 
   */
  async delete(id) {
    try {
      await this.pool.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    } catch (error) {
      logger('error', error);
      throw new Error('Error deleting data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  /**
   * Delete hidden fields from the data
   * 
   * @param {Array} data Data to delete hidden fields
   * @returns {Array} Data without hidden fields
   * 
   */
  async deleteHiddenFields(data) {
    if (this.hidden.length === 0) return data;

    return data.map((item) => {
      this.hidden.forEach((field) => delete item[field]);
      return item;
    });
  }
}
