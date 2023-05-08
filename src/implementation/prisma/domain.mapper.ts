import {injectable, singleton} from 'tsyringe';

import {Product as ProductEntity} from '@prisma/client';

import {Product} from '~/domain/models/private';

@singleton()
@injectable()
export class DomainMapper {
  constructor() {}

  toInternalProduct(entity: ProductEntity): Product {
    return entity;
  }
}
