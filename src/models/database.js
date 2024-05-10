import mysql from 'mysql2/promise';
import { logger } from '../utils/index.js';
import dotenv from "dotenv";

export default class Database {
  constructor() {
    this.init();
  }

  async init() {
    return this.connection();
  }

  connection() {
    dotenv.config();
    try {
      const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        charset: process.env.DB_CHARSET,
      };
      return mysql.createPool(config);
    } catch (error) {
      logger('error', error);
      throw new Error('Error connecting to the database');
    }
  }
}
