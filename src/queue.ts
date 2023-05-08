import 'reflect-metadata';
import {container} from 'tsyringe';
import {startProductsQueueWorker} from '~/implementation/queue/product.queue';
import {ProductRepositoryPrisma} from '~/implementation/prisma/product.repository';
import {ShopifyServiceAPI} from '~/implementation/shopify/shopify.service';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {PinoConfig} from '~/implementation/pino/pino.config';
import {LoggerServicePino} from '~/implementation/pino/logger.service';
import {OrderRepositoryPrisma} from './implementation/prisma/order.repository';
import {PrismaClient} from '@prisma/client';

const pinoConfig = new PinoConfig();
const loggerService = new LoggerServicePino(pinoConfig.getLoggerOptions());
const configService = new ConfigServiceNode();
const prismaClient = new PrismaClient(configService.getPrismaClientOptions());

function StartQueueProcess() {
  container.register('ConfigService', {useValue: configService});
  container.register('LoggerService', {useValue: loggerService});
  container.register('ProductRepository', ProductRepositoryPrisma);
  container.register('OrderRepository', OrderRepositoryPrisma);
  container.register('PrismaClient', {useValue: prismaClient});
  container.register('ShopifyServiceAPI', ShopifyServiceAPI);

  startProductsQueueWorker();
}
Promise.all([StartQueueProcess()]);
