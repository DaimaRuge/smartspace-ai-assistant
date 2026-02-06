import pino from 'pino';

export class Logger {
  private logger: pino.Logger;

  constructor(options?: any) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:HH:MM:ss',
              ignore: 'pid,hostname,reqId',
            },
          }
        : undefined,
      ...options,
    });
  }

  info(message: string, data?: any) {
    this.logger.info(data || {}, message);
  }

  error(message: string, error?: any) {
    this.logger.error(error || {}, message);
  }

  warn(message: string, data?: any) {
    this.logger.warn(data || {}, message);
  }

  debug(message: string, data?: any) {
    this.logger.debug(data || {}, message);
  }

  child(options: any): Logger {
    const childLogger = new Logger({
      ...this.logger,
    });
    childLogger.logger = this.logger.child(options);
    return childLogger;
  }
}

export const logger = new Logger();
