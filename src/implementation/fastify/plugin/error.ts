import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

import fastifyPlugin from 'fastify-plugin';

import {LoggerService} from '~/domain/services/logger.service';
import {ConfigService} from '~/domain/services/config.service';

import {ErrorCode} from '~/domain/errors';

import {ApplicationError} from '~/application/application.error';
import {PersistenceError} from '~/implementation/prisma/persistence.error';

export default (configService: ConfigService, loggerService: LoggerService) => {
  const errorHandler = (
    error: Error,
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    if (error instanceof ApplicationError) {
      onCustomError(error);
    } else if (error instanceof PersistenceError) {
      onCustomError(error);
    } else {
      onError(error);
    }

    function obfuscateMessageInProduction(message: string) {
      return configService.isProductionEnvironment() ? undefined : message;
    }

    function onError(error: Error) {
      const errorCode = ErrorCode.INTERNAL_ERROR;
      const {message} = error;
      send(500, {errorCode, message: obfuscateMessageInProduction(message)});
    }

    function onCustomError(error: ApplicationError | PersistenceError) {
      const {message, errorCode} = error;
      send(400, {errorCode, message: obfuscateMessageInProduction(message)});
    }

    type ErrorPayload = {
      errorCode: string;
      message?: string;
    };

    function send(statusCode: number, errorPayload: ErrorPayload) {
      reply.status(statusCode).send(errorPayload);
    }
  };

  const errorLogger =
    (loggerService: LoggerService) =>
    async (req: FastifyRequest, reply: FastifyReply, error: Error) => {
      loggerService.error(error);
    };

  return fastifyPlugin(async (fastify: FastifyInstance): Promise<void> => {
    fastify.setErrorHandler(errorHandler);
    fastify.addHook('onError', errorLogger(loggerService));
  });
};
