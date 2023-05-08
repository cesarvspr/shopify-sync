import {PinoLoggerOptions} from 'fastify/types/logger';
import {FastifyServerOptions} from 'fastify';

export class FastifyConfig {
  constructor(private loggerOptions: PinoLoggerOptions) {}

  getOptions(): FastifyServerOptions {
    return {
      disableRequestLogging: false,
      logger: this.loggerOptions,
    };
  }
}
