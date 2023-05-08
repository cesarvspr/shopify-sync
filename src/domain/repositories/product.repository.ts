import {Prisma, Product as PrismaProduct} from '@prisma/client';
import {TransactionalContext} from '~/domain/context';

import {ProductResponse} from '~/domain/models/private';
import {Product} from '../models/public';

export interface ProductRepository {
  /**
   * Create product
   *
   * @param context transactional context
   * @param {Product[]} data product parameters
   *
   * @return {Product[]} product parameters if successful
   */
  createProducts(
    context: TransactionalContext,
    data: Product[]
  ): Promise<{count: number}>;

  /* A method that is used to list a unique product. */
  getUniqueProduct(
    prisma: Prisma.TransactionClient,
    productId: string
  ): Promise<PrismaProduct>;

  /* A method that is used to list all products. */
  listProducts(prisma: Prisma.TransactionClient): Promise<ProductResponse>;

  /**
   * delete a product on database
   *
   * @param {string[]} params array of ids to be deleted
   *
   * @return count of deleted rows
   */
  delete(
    context: TransactionalContext,
    params: string[]
  ): Promise<Prisma.BatchPayload>;
}
