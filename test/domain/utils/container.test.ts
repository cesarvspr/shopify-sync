import 'reflect-metadata';
import {container} from 'tsyringe';
import {PrismaClient} from '@prisma/client';
import {expect} from 'chai';

import {PinoConfig} from '../../../src/implementation/pino/pino.config';
import {DomainMapper} from '../../../src/implementation/prisma/domain.mapper';
import {ConfigServiceNode} from '../../../src/implementation/node/config.service';
import {LoggerServicePino} from '../../../src/implementation/pino/logger.service';
import {ProductRepositoryPrisma} from '../../../src/implementation/prisma/product.repository';

describe('test container injections', () => {
  beforeEach(() => {
    container.reset();
  });

  after(() => {
    container.reset();
  });

  it('Test proper registration of repositories', async () => {
    container.register('ProductRepository', ProductRepositoryPrisma);
    expect(container.isRegistered('ProductRepository')).to.be.equals(true);
  });

  it('Test proper registration of configService', async () => {
    const configService = new ConfigServiceNode();
    container.register('ConfigService', {useValue: configService});

    expect(container.isRegistered('ConfigService')).to.be.equals(true);
  });

  it('Test proper registration of LoggerService', async () => {
    const pinoConfig = new PinoConfig();
    const loggerService = new LoggerServicePino(pinoConfig.getLoggerOptions());
    container.register('LoggerService', {useValue: loggerService});

    expect(container.isRegistered('LoggerService')).to.be.equals(true);
  });

  it('Test proper registration of PrismaClient', async () => {
    const configService = new ConfigServiceNode();
    const prismaClient = new PrismaClient(
      configService.getPrismaClientOptions()
    );
    container.register('PrismaClient', {useValue: prismaClient});

    expect(container.isRegistered('PrismaClient')).to.be.equals(true);
  });

  it('Test proper registration of DomainMapper', async () => {
    container.register('DomainMapper', DomainMapper);
    expect(container.isRegistered('DomainMapper')).to.be.equals(true);
  });
});
