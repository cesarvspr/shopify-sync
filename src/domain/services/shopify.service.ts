import {Prisma} from '@prisma/client';
import {Product, Order} from '../models/public';

export interface ShopifyService {
  getProducts(): Promise<Product[]>;
  getOrders(): Promise<Order[]>;
}
