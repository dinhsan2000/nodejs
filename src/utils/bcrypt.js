import bcrypt from 'bcrypt';
import { logger } from './index.js';
import dotenv from 'dotenv';

export class Bcrypt {
  constructor() {
    dotenv.config();
  }
  async hash(data) {
    try {
      const salt = Number(process.env.BCRYPT_SALT_ROUNDS);
      console.log(salt);
      return await bcrypt.hash(data, Number(process.env.BCRYPT_SALT_ROUNDS || 10));
    } catch (error) {
      logger('error', error);
      throw error;
    }
  }

  async compare(data, encrypted) {
    try {
      return await bcrypt.compare(data, encrypted);
    } catch (error) {
      logger('error', error);
      throw error;
    }
  }
}