import {inject, injectable, singleton} from 'tsyringe';

import {ErrorCode} from '~/domain/errors/domain.error';

import {Order as shopifyOrder} from '~/domain/models/public';

import {OrderRepository} from '~/domain/repositories/order.repository';

import {LoggerService} from '~/domain/services/logger.service';

import {Prisma, Order, PrismaClient} from '@prisma/client';

import {ApplicationError} from '~/application/application.error';
import {PersistenceError} from '~/implementation/prisma/persistence.error';

@singleton()
@injectable()
export class OrderRepositoryPrisma implements OrderRepository {
  constructor(
    @inject('LoggerService') private readonly loggerService: LoggerService,

    @inject('PrismaClient') private readonly prisma: PrismaClient
  ) {}

  async createOrders(inputOrders: shopifyOrder[]): Promise<Order[]> {
    try {
      const prisma_data = inputOrders?.map(o => {
        const prisma_order = {
          line_items: o?.line_items,
          platform_id: String(o.id),
        };
        return prisma_order;
      });

      const createdOrders: Order[] = [];
      for (const order of prisma_data) {
        const {platform_id, line_items} = order;

        const lineItemsId = line_items.map(e => {
          return String(e.product_id);
        });

        for (const itemId of lineItemsId) {
          const item = await this.prisma.product.findFirst({
            where: {platform_id: itemId},
          });
          const find_order = await this.prisma.order.findFirst({
            where: {
              platform_id,
            },
          });
          if (find_order) {
            continue;
          }
          if (item) {
            const order = await this.prisma.order.create({
              data: {
                platform_id,
                line_items: {
                  create: {
                    product_id: itemId,
                  },
                },
              },
            });
            createdOrders.push(order);
          }
        }
      }

      return createdOrders;
    } catch (e) {
      //TODO: Sentry capture
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.loggerService.error(e);
        throw new PersistenceError(ErrorCode.INTERNAL_ERROR, e.message);
      }
      const error = e as Error;
      this.loggerService.error(error);
      throw new ApplicationError(ErrorCode.INTERNAL_ERROR, error.message);
    }
  }

  async listOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({take: 200, include: {line_items: true}});
  }
}
