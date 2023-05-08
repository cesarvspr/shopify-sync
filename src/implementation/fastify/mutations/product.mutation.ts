import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {ProductApplication} from '~/application/product.application';

import {Prisma, PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services/config.service';

import {AbstractMutation} from '~/implementation/fastify/mutations/abstract.mutation';

import {
  JobResponse,
  ProductQuery,
  ProductResponse,
} from '~/domain/models/private';

@singleton()
export class ProductMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService') configService: ConfigService,
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(ProductApplication)
    private readonly productApplication: ProductApplication
  ) {
    super(configService);
  }

  async getProducts(
    req: FastifyRequest<{Params: ProductQuery}>
  ): Promise<ProductResponse> {
    return this.prisma.$transaction(
      async prisma => this.productApplication.listProducts(prisma, req.params),
      this.configService.getPrismaTransactionOptions()
    );
  }

  async deleteProduct(
    req: FastifyRequest<{Params: ProductQuery}>
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.$transaction(
      async prisma => this.productApplication.delete(prisma, req.params),
      this.configService.getPrismaTransactionOptions()
    );
  }

  async currentProductQueue(
    req: FastifyRequest<{Params: ProductQuery}>
  ): Promise<JobResponse> {
    if (req.params.id)
      return await this.productApplication.jobFromQueue(req.params.id);
    return await this.productApplication.currentProductQueue();
  }
}
