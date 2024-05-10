import winston from 'winston';

export class Logger {
  level = '';

  constructor() {
    this.init();
  }

  init() {
    const date = new Date();
    const formatDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    // Create a logger instance
    this.logger = winston.createLogger({
      level: this.level || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          dirname: './src/logs',
          filename: `${this.level}${formatDate}.log`,
          level: this.level,
          maxFiles: 5242880,
          format: winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }),
        }),
      ],
    });
  }

  log(level, message) {
    this.level = level;
    this.logger.log(level, message);
  }

  info(message) {
    this.level = level;
    this.logger('info', message);
  }

  error(message) {
    this.level = level;
    this.logger('error', message);
  }

  warn(message) {
    this.level = level;
    this.logger('warn', message);
  }

  debug(message) {
    this.level = level;
    this.logger('debug', message);
  }
}
