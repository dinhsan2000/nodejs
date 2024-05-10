import winston from "winston";

export class Logger {
  constructor() {
    this.init();
  }

  init() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
      transports: [
        new winston.transports.File({filename: './logs/error.log', level: 'error'}),
        new winston.transports.File({filename: './logs/combined.log', level: 'info'}),
      ]
    });
  }

  log(level, message) {
    this.logger.log(level, message);
  }

  info(message) {
    this.logger('info', message);
  }

  error(message) {
    this.logger('error', message);
  }

  warn(message) {
    this.logger('warn', message);
  }

  debug(message) {
    this.logger('debug', message);
  }
}