import bcrypt from 'bcrypt';
import { logger } from './index.js';

export class Bcrypt {
  async hash(data) {
    try {
      return await bcrypt.hash(data, Number(process.env.BCRYPT_SALT_ROUNDS || 10));
    } catch (error) {
      logger('error', error);
      throw error;
    }
  }
}