/* eslint-disable @typescript-eslint/no-explicit-any */
import {injectable, singleton} from 'tsyringe';

import {LoggerService} from '~/domain/services/logger.service';

import pino from 'pino';

@singleton()
@injectable()
export class LoggerServicePino implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(loggerOptions: pino.LoggerOptions) {
    this.logger = pino(loggerOptions);
  }

  info(msg?: string, ...args: any) {
    this.logger.info(msg, ...args);
  }

  error(err: Error, msg?: string, ...args: any) {
    this.logger.error(err, msg, ...args);
  }

  warning(msg?: string, ...args: any) {
    this.logger.warn(msg, ...args);
  }

  debug(msg?: string, ...args: any) {
    this.logger.debug(msg, ...args);
  }

  trace(msg?: string, ...args: any) {
    this.logger.trace(msg, ...args);
  }
}
