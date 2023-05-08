import {inject, injectable, singleton} from 'tsyringe';

import {ErrorCode} from '~/domain/errors/domain.error';

import {ProductResponse} from '~/domain/models/private';
import {Product as shopifyProduct} from '~/domain/models/public';

import {ProductRepository} from '~/domain/repositories/product.repository';

import {LoggerService} from '~/domain/services/logger.service';

import {Prisma, Product} from '@prisma/client';

import {ValidationError} from '~/application/validation.error';
import {ApplicationError} from '~/application/application.error';
import {PersistenceError} from '~/implementation/prisma/persistence.error';
import {ConfigService} from '~/domain/services/config.service';

@singleton()
@injectable()
export class ProductRepositoryPrisma implements ProductRepository {
  constructor(
    @inject('LoggerService') private readonly loggerService: LoggerService,
    @inject('ConfigService') private readonly configService: ConfigService
  ) {}
  async createProducts(
    context: Prisma.TransactionClient,
    inputProducts: shopifyProduct[]
  ): Promise<{count: number}> {
    try {
      const notInDb: Pick<Product, 'name' | 'platform_id'>[] = [];
      const prisma_data = inputProducts?.map(p => {
        const prisma_product = {
          name: p.title || '',
          platform_id: String(p.id),
        };
        return prisma_product;
      });

      for (const product of prisma_data) {
        const {name, platform_id} = product;
        const find = await context.product.findFirst({
          where: {
            name,
            platform_id,
          },
        });
        if (!find) {
          notInDb.push(product);
        }
      }

      const data = await context.product.createMany({
        data: notInDb,
      });

      return data;
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

  async getUniqueProduct(
    context: Prisma.TransactionClient,
    productId: string
  ): Promise<Product> {
    const Product = await context.product.findFirst({
      where: {OR: [{platform_id: productId}, {id: productId}]},
    });
    if (!Product) throw new ValidationError(ErrorCode.PRODUCT_ID_NOT_FOUND);
    return Product;
  }

  async listProducts(
    context: Prisma.TransactionClient
  ): Promise<ProductResponse> {
    return context.product.findMany({take: 200});
  }

  async delete(
    context: Prisma.TransactionClient,
    ids: string[]
  ): Promise<Prisma.BatchPayload> {
    return context.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
