# User Management System with Dynamic RBAC

A complete user management system with dynamic role-based access control (RBAC) built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- Password management (reset, update)
- User profile management
- Dynamic role-based access control
- Custom permission management
- Input sanitization and validation
- API documentation with Swagger
- RESTful API

## Requirements

- Node.js (v14+)
- MongoDB (v4+)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/user-management-system.git
cd user-management-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Copy the example .env file and modify it according to your environment
cp .env.example .env
```

4. Seed the database with initial data
```bash
npm run seed
```

5. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

The API documentation is available through Swagger UI at:
```
http://localhost:5000/api-docs
```

This provides an interactive UI to explore and test all available endpoints.

## Input Validation & Security

The API implements robust input validation and sanitization using express-validator. This helps prevent:

- XSS (Cross-Site Scripting) attacks
- SQL Injection
- NoSQL Injection
- Data validation errors

All input data is validated and sanitized before processing. Error messages will be returned for any invalid inputs.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Users

- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/:id` - Get single user
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/password` - Change user password

### Roles

- `GET /api/v1/roles` - Get all roles
- `GET /api/v1/roles/:id` - Get single role
- `POST /api/v1/roles` - Create role
- `PUT /api/v1/roles/:id` - Update role
- `DELETE /api/v1/roles/:id` - Delete role
- `GET /api/v1/roles/:id/permissions` - Get role permissions
- `PUT /api/v1/roles/:id/permissions` - Update role permissions

### Permissions

- `GET /api/v1/permissions` - Get all permissions
- `GET /api/v1/permissions/:id` - Get single permission
- `POST /api/v1/permissions` - Create permission
- `PUT /api/v1/permissions/:id` - Update permission
- `DELETE /api/v1/permissions/:id` - Delete permission
- `GET /api/v1/permissions/resource/:resource` - Get permissions by resource

## Default Users

After running the seeder, the following users will be created:

1. Super Admin
   - Email: superadmin@example.com
   - Password: password123
   - Role: superadmin (all permissions)

2. Admin
   - Email: admin@example.com
   - Password: password123
   - Role: admin (all permissions except role management)

3. Regular User
   - Email: user@example.com
   - Password: password123
   - Role: user (minimal permissions)

## Role-Based Access Control

The system uses a dynamic RBAC model where:

1. **Permissions** define what actions can be performed on what resources
2. **Roles** are collections of permissions
3. **Users** are assigned roles

This allows for flexible access control where:
- New roles can be created with custom permissions
- Permissions can be added or removed from roles
- Users can be assigned different roles

## License

MIT 