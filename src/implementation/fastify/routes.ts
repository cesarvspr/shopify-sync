import {container} from 'tsyringe';

import {FastifyInstance} from 'fastify';

import fastifyPlugin from 'fastify-plugin';

import {ProductMutationFastify} from '~/implementation/fastify/mutations/product.mutation';
import {OrderRepositoryPrisma} from '~/implementation/prisma/order.repository';
import {getSingleIdSchema} from '~/implementation/fastify/schemas';
import {ProductQueue} from '~/implementation/queue';

const productQuery = container.resolve(ProductMutationFastify);
const orderQuery = container.resolve(OrderRepositoryPrisma);

export default fastifyPlugin(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.get('/', async (): Promise<void> => {}); // Health check

    fastify.get('/products/:id', {
      schema: getSingleIdSchema,
      handler: productQuery.getProducts.bind(productQuery),
    });

    fastify.get('/products', {
      handler: productQuery.getProducts.bind(productQuery),
    });

    fastify.delete('/products/:id', {
      schema: getSingleIdSchema,
      handler: productQuery.deleteProduct.bind(productQuery),
    });

    fastify.get('/product/jobs/:id', {
      schema: getSingleIdSchema,
      handler: productQuery.currentProductQueue.bind(productQuery),
    });

    fastify.get('/product/jobs', {
      handler: productQuery.currentProductQueue.bind(productQuery),
    });

    fastify.get('/product/sync', {
      handler: async () => {
        const job = await ProductQueue.add(undefined);
        return job;
      },
    });

    fastify.get('/orders', {
      handler: async () => {
        return await orderQuery.listOrders();
      },
    });
  }
);
