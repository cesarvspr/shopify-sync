export {default as Opts} from './opts';

import opts from '~/implementation/queue/opts';

import Queue from 'bull';

export const ProductQueue = new Queue('ProductCreation', {
  redis: {
    port: opts.port,
    host: opts.host,
  },
});
