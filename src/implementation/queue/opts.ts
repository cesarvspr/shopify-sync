import {container} from 'tsyringe';
import {ConfigService} from '~/domain/services/config.service';
import {ConfigServiceNode} from '~/implementation/node/config.service';

if (!container.isRegistered('ConfigService')) {
  container.register('ConfigService', ConfigServiceNode);
}

const configService = container.resolve<ConfigService>('ConfigService');

// redis setup
const opts = configService.getRedisAddress();

export default opts;
