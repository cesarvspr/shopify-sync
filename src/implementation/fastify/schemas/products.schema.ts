import {FastifySchema} from 'fastify';
const MAX_UPLOAD_SIZE = 500000;

export const uploadSchema: FastifySchema = {
  headers: {
    type: 'object',
    properties: {
      'Content-Type': {
        type: 'string',
      },
      'Content-Length': {
        type: 'number',
        maximum: MAX_UPLOAD_SIZE,
      },
    },
    required: ['Content-Length', 'Content-Type'],
  },
  body: {
    type: 'object',
    properties: {
      file: {
        type: 'object',
      },
    },
    required: ['file'],
  },
};

export const getSingleIdSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string'},
    },
  },
};
