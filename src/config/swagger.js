const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'A complete user management system with dynamic role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API Server'
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            },
            role: {
              type: 'string',
              description: 'User role ID'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number'
            },
            active: {
              type: 'boolean',
              description: 'User active status'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Role name'
            },
            description: {
              type: 'string',
              description: 'Role description'
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Permission ID'
              }
            },
            isDefault: {
              type: 'boolean',
              description: 'Is this the default role'
            },
            isSystemRole: {
              type: 'boolean',
              description: 'Is this a system role'
            }
          }
        },
        Permission: {
          type: 'object',
          properties: {
            resource: {
              type: 'string',
              description: 'Resource name'
            },
            description: {
              type: 'string',
              description: 'Permission description'
            },
            actions: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['create', 'read', 'update', 'delete', 'list']
              },
              description: 'Allowed actions on resource'
            },
            isSystem: {
              type: 'boolean',
              description: 'Is this a system permission'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
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
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-feeling-blue.css'
  })
}; 