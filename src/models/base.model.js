import mysql from 'mysql2/promise';
import { logger } from '../utils/index.js';
import Database from "./database.js";

export class BaseModel extends Database {
  table = '';
  hidden = [];

  constructor() {
    super();
    this.init();
  }

  async init() {
    try{
      this.pool = this.connection();
    } catch (error) {
      logger('error', error);
      throw new Error('Error initializing database');
    }
  }

  async getAll() {
    try {
      const [rows] = await this.pool.query(`SELECT * FROM ${this.table}`);

      return this.deleteHiddenFields(rows);
    } catch (error) {
      logger('error', error);
      throw new Error('Error fetching data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async create(data) {
    try {
      const [rows, fields] = await this.pool.query(
        `INSERT INTO ${this.table} SET ?`,
        data,
      );
      const [newData] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        rows.insertId,
      );

      return this.deleteHiddenFields(newData);
    } catch (error) {
      logger('error', error);
      throw new Error('Error creating data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async update(data, id) {
    try {
      const [rows, fields] = await this.pool.query(
        `UPDATE ${this.table} SET ? WHERE id = ?`,
        [data, id],
      );
      const [newData] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        id,
      );

      return this.deleteHiddenFields(newData);
    } catch (error) {
      logger('error', error);
      throw new Error('Error updating data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async delete(id) {
    try {
      const [rows, fields] = await this.pool.query(
        `DELETE FROM ${this.table} WHERE id = ?`,
        id,
      );

      return rows;
    } catch (error) {
      logger('error', error);
      throw new Error('Error deleting data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async select(id = null, ...field) {
    try {
      let query = `SELECT ${field.length > 0 ? field.join(',') : '*'} FROM ${this.table}`;
      if (id) {
        query += ` WHERE id = ${id}`;
      }
      const [rows, fields] = await this.pool.query(query);

      return rows;
    } catch (error) {
      logger('error', error);
      throw new Error('Error fetching data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async find(id) {
    try {
      const [row, fields] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        id,
      );

      return this.deleteHiddenFields(row);
    } catch (error) {
      logger('error', error);
      throw new Error('Error fetching data');
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async deleteHiddenFields(data) {
    let newData = [];
    try {
      if (this.hidden.length > 0) {
        this.hidden.forEach((field) => {
          newData = data.map((item) => {
            delete item[field];
            return item;
          });
        });
      }
    } catch (error) {
      logger('error', error);
      throw new Error('Error deleting hidden fields');
    }
    return newData;
  }
}
