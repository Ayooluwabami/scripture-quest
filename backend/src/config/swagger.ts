import swaggerJsdoc from 'swagger-jsdoc';
import { envConfig } from './env.config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scripture Quest API',
      version: '1.0.0',
      description: 'Interactive Bible Learning Application API',
      contact: {
        name: 'Scripture Quest Team',
        email: 'support@scripturequest.com'
      },
    },
    servers: [
      {
        url: envConfig.NODE_ENV === 'production' 
          ? 'https://api.scripturequest.com' 
          : `http://localhost:${envConfig.PORT}`,
        description: envConfig.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' },
                  data: { type: 'null' }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  message: { type: 'string' },
                  data: { type: 'null' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);