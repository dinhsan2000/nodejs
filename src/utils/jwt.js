import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

export class JWT {
  constructor() {
    dotenv.config();
  }

  static async sign(payload, options) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.JWT_SECRET_KEY, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  static async verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
