import {inject} from 'tsyringe';

import {ConfigService} from '~/domain/services/config.service';

export abstract class AbstractMutation {
  constructor(
    @inject('ConfigService') protected readonly configService: ConfigService
  ) {}
}
