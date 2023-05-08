import 'reflect-metadata';

import {container} from 'tsyringe';

import fastify from 'fastify';
import fileUpload from 'fastify-file-upload';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyErrors from '~/implementation/fastify/plugin/error';
import {FastifyConfig} from '~/implementation/fastify/fastify.config';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {LoggerServicePino} from '~/implementation/pino/logger.service';
import {ConfigServiceNode} from '~/implementation/node/config.service';

import {ProductRepositoryPrisma} from '~/implementation/prisma/product.repository';

import {PrismaClient} from '@prisma/client';
import {PinoConfig} from '~/implementation/pino/pino.config';

const configService = new ConfigServiceNode();
const pinoConfig = new PinoConfig();
const fastifyConfig = new FastifyConfig(pinoConfig.getLoggerOptions());
const loggerService = new LoggerServicePino(pinoConfig.getLoggerOptions());
const prismaClient = new PrismaClient(configService.getPrismaClientOptions());

container.register('ConfigService', {useValue: configService});
container.register('LoggerService', {useValue: loggerService});
container.register('PrismaClient', {useValue: prismaClient});

container.register('DomainMapper', DomainMapper);
container.register('ProductRepository', ProductRepositoryPrisma);

import fastifyRoutes from '~/implementation/fastify/routes';

async function init(): Promise<void> {
  const server = await fastify(fastifyConfig.getOptions());

  await server.register(fastifyCors);
  await server.register(fastifyErrors(configService, loggerService));
  await server.register(fastifyRoutes);
  await server.register(fastifyHelmet);
  await server.register(fileUpload);

  const host = configService.getServerHost();
  const port = configService.getServerPort();
  await server.listen({host, port});
}

Promise.all([init()]);
