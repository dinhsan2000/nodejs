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

  whereNotNull(field) {
    this.sql = `SELECT * FROM ${this.table} WHERE ${field} IS NOT NULL`;
    return this;
  }

  async select(...fields) {
    this.sql = `SELECT ${fields.join(', ')} FROM ${this.table}`;
    return this;
  }

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

  async deleteHiddenFields(data) {
    if (this.hidden.length === 0) return data;

    return data.map((item) => {
      this.hidden.forEach((field) => delete item[field]);
      return item;
    });
  }
}
