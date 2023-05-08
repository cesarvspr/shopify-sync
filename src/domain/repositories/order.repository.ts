import {Prisma, Order as PrismaOrder} from '@prisma/client';

import {Order} from '../models/public';

export interface OrderRepository {
  /* A method that is used to list all orders. */
  listOrders(prisma: Prisma.TransactionClient): Promise<PrismaOrder[]>;
  createOrders(inputProducts: Order[]): Promise<PrismaOrder[]>;
}
