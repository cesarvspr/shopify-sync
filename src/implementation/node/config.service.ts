import {injectable, singleton} from 'tsyringe';

import dotenv from 'dotenv';

import {Prisma} from '@prisma/client';

import {ConfigService} from '~/domain/services/config.service';

const PRODUCTION_ENVIRONMENT = 'production';
const DEVELOPMENT_ENVIRONMENT = 'development';

export const isProduction: boolean =
  PRODUCTION_ENVIRONMENT === process.env.NODE_ENV;
export const isDevelopment: boolean =
  DEVELOPMENT_ENVIRONMENT === process.env.NODE_ENV;

@singleton()
@injectable()
export class ConfigServiceNode implements ConfigService {
  constructor() {
    if (!isProduction) {
      dotenv.config();
    }
  }

  getEnvironmentName(): string {
    return this.isProductionEnvironment()
      ? PRODUCTION_ENVIRONMENT
      : DEVELOPMENT_ENVIRONMENT;
  }

  isProductionEnvironment(): boolean {
    return isProduction;
  }

  getServerPort(): number {
    return this.getRequiredInt('APP_PORT', process.env.APP_PORT);
  }

  getServerHost(): string {
    return this.getOptionalStringOrElse(
      'APP_HOST',
      process.env.APP_HOST,
      'localhost'
    );
  }

  getPrismaTransactionMaxWait(): number {
    return this.getRequiredInt(
      'PRISMA_TRANSACTION_MAX_WAIT',
      process.env.PRISMA_TRANSACTION_MAX_WAIT
    );
  }

  getPrismaTransactionTimeout(): number {
    return this.getRequiredInt(
      'PRISMA_TRANSACTION_TIMEOUT',
      process.env.PRISMA_TRANSACTION_TIMEOUT
    );
  }

  isPrismaLogEnabled(): boolean {
    return this.getRequiredBoolean(
      'PRISMA_LOG_QUERY_ENABLED',
      process.env.PRISMA_LOG_QUERY_ENABLED
    );
  }

  getPrismaClientOptions(): Prisma.PrismaClientOptions {
    return {
      log: this.isPrismaLogEnabled() ? ['query', 'info', 'warn', 'error'] : [],
    };
  }

  getPrismaTransactionOptions(): {maxWait?: number; timeout?: number} {
    return {
      maxWait: this.getPrismaTransactionMaxWait(),
      timeout: this.getPrismaTransactionTimeout(),
    };
  }

  getRedisAddress() {
    return {
      host: this.getRedisHost(),
      port: this.getRedisPort(),
    };
  }
  getShopifyHeaders() {
    return {
      'X-Shopify-Access-Token': this.getShopifyAccessToken(),
    };
  }

  getShopifyUrl() {
    return this.getShopifyBaseUrl();
  }

  private getRedisHost() {
    return this.getRequiredString('REDIS_ADDRESS', process.env.REDIS_ADDRESS);
  }
  private getShopifyAccessToken() {
    return this.getRequiredString(
      'SHOPIFY_ACCESS_TOKEN',
      process.env.SHOPIFY_ACCESS_TOKEN
    );
  }

  private getShopifyBaseUrl() {
    return this.getRequiredString(
      'SHOPIFY_BASE_URL',
      process.env.SHOPIFY_BASE_URL
    );
  }

  private getRedisPort() {
    return this.getRequiredInt('REDIS_PORT', process.env.REDIS_PORT);
  }
  private getRequiredInt(key: string, value: string | undefined): number {
    return parseInt(this.getRequiredString(key, value));
  }

  private getRequiredString(key: string, value: string | undefined): string {
    if (!value) throw new Error(`CONFIG__${key}_REQUIRED`);
    return value;
  }

  private getRequiredBoolean(key: string, value: string | undefined): boolean {
    if (!value) if (!value) throw new Error(`CONFIG__${key}_REQUIRED`);
    return 'true' === value;
  }

  private getOptionalStringOrElse(
    key: string,
    value: string | undefined,
    elseValue: string
  ): string {
    return value || elseValue;
  }
}
