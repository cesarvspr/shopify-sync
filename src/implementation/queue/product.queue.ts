import 'reflect-metadata';

import {container} from 'tsyringe';

import {LoggerService} from '~/domain/services/logger.service';
import {ConfigService} from '~/domain/services/config.service';
import {ShopifyService} from '~/domain/services/shopify.service';

import {ProductRepository} from '~/domain/repositories/product.repository';

import {ProductQueue} from '.';

import {PrismaClient} from '@prisma/client';
import {OrderRepository} from '~/domain/repositories/order.repository';

export async function startProductsQueueWorker() {
  const loggerService = container.resolve<LoggerService>('LoggerService');
  const configService = container.resolve<ConfigService>('ConfigService');
  const ShopifyService = container.resolve<ShopifyService>('ShopifyServiceAPI');
  const productRepository =
    container.resolve<ProductRepository>('ProductRepository');
  const orderRepository = container.resolve<OrderRepository>('OrderRepository');

  loggerService.info('launched queue process');
  const prismaClient = new PrismaClient(configService.getPrismaClientOptions());

  async function fetchProducts() {
    const products = await ShopifyService.getProducts();
    await prismaClient.$transaction(async ctx => {
      const db = await productRepository.createProducts(ctx, products);
      loggerService.info(`Worker finished and created ${db?.count} products`);
    }, configService.getPrismaTransactionOptions());
  }

  async function fetchOrders() {
    const orders = await ShopifyService.getOrders();
    const db = await orderRepository.createOrders(orders);
    loggerService.info(`Worker finished and created ${db?.length} orders`);
  }

  await fetchProducts();
  await fetchOrders();
  ProductQueue.process(async (job, done) => {
    await fetchProducts();
    await fetchOrders();
    done();
  });
}
