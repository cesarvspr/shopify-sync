import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import {Prisma, Product} from '@prisma/client';

import {JobResponse, ProductQuery} from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';
import {ProductRepository} from '~/domain/repositories/product.repository';
import {TransactionalContext} from '~/domain/context';

import {ProductQueue} from '~/implementation/queue';
import {ValidationError} from '~/application/validation.error';
import {toJobResponse} from '~/domain/utils/mappers';

@singleton()
@injectable()
export class ProductApplication {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  /**
   * create a product on database and validate input
   *
   * @param {ProductQuery} params params to filter get method return
   *
   * @return array with Products
   */
  async listProducts(
    context: TransactionalContext,
    params: ProductQuery
  ): Promise<Product[] | Product> {
    const {id} = params;

    if (id) {
      return await this.productRepository.getUniqueProduct(context, id);
    }

    return await this.productRepository.listProducts(context);
  }

  /**
   * delete a product on database
   *
   * @param {ProductQuery} params params to filter method action
   *
   * @return count of deleted rows
   */
  async delete(
    context: TransactionalContext,
    params: ProductQuery
  ): Promise<Prisma.BatchPayload> {
    const {id} = params;
    return await this.productRepository.delete(context, [id]);
  }

  async currentProductQueue(): Promise<JobResponse> {
    const jobs = await ProductQueue.getJobs([
      'completed',
      'active',
      'failed',
      'waiting',
    ]);

    return Promise.all([...(await toJobResponse(jobs))]);
  }

  async jobFromQueue(jobId: string): Promise<JobResponse> {
    const job = await ProductQueue.getJob(jobId);

    if (!job) throw new ValidationError(ErrorCode.JOB_ID_NOT_FOUND);
    return toJobResponse([job]);
  }
}
