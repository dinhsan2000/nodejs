import {Logger} from "../logger.js";

export function logger(level, message) {
  const loggers = new Logger();
  loggers.log(level, message);
}