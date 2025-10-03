const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSAT API',
      version: '1.0.0',
      description: 'API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '개발 서버',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocument = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerDocument };
