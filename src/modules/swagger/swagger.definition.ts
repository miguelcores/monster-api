import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Monster API documentation',
    version: '0.0.1',
    description: 'This is Monster node express mongoose API in typescript',
    license: { name: 'Private License', url: 'https://example.com/license' },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
