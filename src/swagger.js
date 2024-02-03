const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API description',
    },
  },
  apis: ['../Routes/UserRouter.js'], // Path to the API routes or files containing Swagger JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
