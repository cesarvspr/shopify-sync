import {Prisma} from '@prisma/client';
import {AxiosRequestHeaders} from 'axios';

export interface ConfigService {
  getEnvironmentName(): string;

  isProductionEnvironment(): boolean;

  getServerPort(): number;

  getServerHost(): string;
  getShopifyUrl(): string;
  getShopifyHeaders(): Record<string, string>;

  isPrismaLogEnabled(): boolean;

  getPrismaTransactionTimeout(): number;

  getPrismaTransactionMaxWait(): number;

  getPrismaClientOptions(): Prisma.PrismaClientOptions;

  getPrismaTransactionOptions(): {maxWait?: number; timeout?: number};

  getRedisAddress(): {host: string; port: number};
}
