import {FastifySchema} from 'fastify';

export const getSingleIdSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string'},
    },
  },
};
