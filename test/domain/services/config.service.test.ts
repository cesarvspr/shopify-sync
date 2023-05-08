import 'reflect-metadata';

import {expect} from 'chai';
import {container} from 'tsyringe';
import {ConfigService} from '../../../src/domain/services/config.service';
import {ConfigServiceNode} from '../../../src/implementation/node/config.service';

describe('Config service tests', () => {
  before(() => {
    container.register('ConfigService', ConfigServiceNode);
  });

  it('node function must return host and port', () => {
    const configService = container.resolve<ConfigService>('ConfigService');
    const {port, host} = configService.getRedisAddress();
    expect(port).to.be.not.undefined;
    expect(host).to.be.not.undefined;
  });
});
