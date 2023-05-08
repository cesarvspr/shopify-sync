import {inject, injectable, singleton} from 'tsyringe';

import {ShopifyService} from '~/domain/services/shopify.service';
import {ConfigService} from '~/domain/services/config.service';

import {Product, Order} from '~/domain/models/public';

import axios from 'axios';

@singleton()
@injectable()
export class ShopifyServiceAPI implements ShopifyService {
  constructor(
    @inject('ConfigService') protected readonly configService: ConfigService
  ) {}

  async getProducts() {
    const INITIAL_REQUEST = `${this.configService.getShopifyUrl()}/products.json?limit=50`;
    let nextPage = undefined;

    const prod: Product[] = [];
    while (nextPage !== null) {
      const {
        data: {products},
        headers,
      } = await axios.get<{products: Product[]}>(
        `${!nextPage ? INITIAL_REQUEST : nextPage}`,
        {
          headers: this.configService.getShopifyHeaders(),
        }
      );
      prod.push(...products);
      nextPage = getNextPageUrl(headers?.link);
    }
    return prod;
  }
  async getOrders() {
    const INITIAL_REQUEST = `${this.configService.getShopifyUrl()}/orders.json?limit=50`;
    let nextPage = undefined;

    const ord: Order[] = [];
    while (nextPage !== null) {
      const {
        data: {orders},
        headers,
      } = await axios.get<{orders: Order[]}>(
        `${!nextPage ? INITIAL_REQUEST : nextPage}`,
        {
          headers: this.configService.getShopifyHeaders(),
        }
      );
      ord.push(...orders);
      nextPage = getNextPageUrl(headers?.link);
    }

    return ord;
  }
}

function getNextPageUrl(link?: string): string | null {
  if (!link) {
    return null;
  }

  const linkHeader = link
    .split(',')
    .find((link: string | string[]) => link.includes('rel="next"'));

  if (!linkHeader) {
    return null;
  }

  const match = linkHeader.match(/<(.*)>/);
  return match ? match[1] : null;
}
