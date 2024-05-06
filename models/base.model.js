import mysql from 'mysql2/promise';

export class BaseModel {

  table = '';
  hidden = [];

  constructor() {
    this.init();
  }

  async init() {
    try {
      return this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
    } catch (error) {
      console.log('Connection Error: ', error);
    }
  };

  async getAll() {
    try {
      const [rows] = await this.pool.query(`SELECT * FROM ${this.table}`);

      return this.deleteHiddenFields(rows);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async create(data) {
    try {
      const [rows] = await this.pool.query(`INSERT INTO ${this.table} SET ?`, data);

      return rows;
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async update(data, id) {
    try {
      const [rows, fields] = await this.pool.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [data, id]);

      return rows;
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async delete(id) {
    try {
      const [rows, fields] = await this.pool.query(`DELETE FROM ${this.table} WHERE id = ?`, id);

      return rows;
    } catch (error) {
      console.log('Error: ', error);
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
      console.log('Error: ', error);
    } finally {
      await this.pool.end(); // Close the connection
    }
  }

  async deleteHiddenFields(data) {
    let newData = [];
    if (this.hidden.length > 0) {
      this.hidden.forEach((field) => {
        newData = data.map((item) => {
          delete item[field];
          return item;
        });
      });
    }

    return newData;
  }
}