# Users API - Authentication & Authorization Study Project

<p align="center">
  A NestJS learning project focused on implementing authentication, authorization, and user management features.
</p>

## Description

This repository contains a **study project** built with [NestJS](https://github.com/nestjs/nest) to learn and practice:

- 🔐 **Authentication** (Login/Register) - ✅ **Completed**
- 🛡️ **Authorization** (Role-based access control) - ✅ **Completed**
- 👤 **User Management** (CRUD operations) - ✅ **Completed**
- 🔑 **JWT Token handling** - ✅ **Completed**
- 🔒 **Password hashing and security** - ✅ **Completed**
- 🛠️ **Guards, Pipes, and Interceptors** - ✅ **Completed**
- 📚 **API Documentation with Swagger** - _Planned_

## Learning Objectives

- ✅ Understand NestJS project structure and modules
- ✅ Practice TypeScript and NestJS best practices
- ✅ Learn database integration with TypeORM
- ✅ Implement input validation with DTOs
- ✅ Handle password encryption with bcrypt
- ✅ Understand JWT authentication flow
- ✅ Implement role-based authorization
- ✅ Learn NestJS decorators and guards
- 🔄 Handle validation and error management
- 🔄 Generate comprehensive API documentation with Swagger

## Current Features ✅

- 👤 **User CRUD Operations** - Complete user management with role-based access
- 🗄️ **Database Integration** - PostgreSQL with TypeORM
- 🔒 **Password Security** - bcrypt hashing implementation
- ✅ **Input Validation** - DTOs with class-validator and proper error handling
- 🏷️ **User Types** - Enum-based user roles (Admin, User, Moderator)
- 📝 **Proper Entity Design** - TypeORM entities with relationships
- 🔐 **JWT Authentication** - Login with email/password
- 🛡️ **Route Protection** - Authentication and authorization guards
- 🔑 **Token Validation** - JWT token verification and user extraction
- 🎯 **Role-Based Authorization** - Admin-only and role-specific endpoints
- 🚫 **Proper Error Handling** - ConflictException for duplicates and proper HTTP status codes, not entirely done
- 🛠️ **Database Seeding** - Admin user creation script

## Planned Features 🔄

- 📚 Swagger API documentation
- 🧪 Unit and integration tests
- 📋 Enhanced error handling with custom filters

## API Endpoints

### Users Management (Protected Routes)

```
GET    /users           # Get all users (Admin/Moderator only)
GET    /users/:id       # Get user by ID (Admin only)
POST   /users           # Create new user (Admin only)
PATCH  /users/:id       # Update user (Authenticated users)
DELETE /users/:id       # Delete user (Admin only)
```

### Authentication ✅

```
POST   /auth/login      # User login (returns JWT token)
GET    /auth/me         # Get current user info (protected)
```

### Admin Setup

```bash
npm run seed:admin      # Create initial admin user
```

## Current Project Structure

```
src/
├── auth/
│   ├── guards/
│   │   ├── auth.guard.ts         ✅
│   │   └── roles.guard.ts        ✅
│   ├── types/
│   │   └── auth.types.ts         ✅
│   ├── auth.controller.ts        ✅
│   ├── auth.service.ts           ✅
│   ├── auth.module.ts            ✅
│   └── roles.decorator.ts        ✅
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts    ✅
│   │   ├── update-user.dto.ts    ✅
│   │   └── user-response.dto.ts  ✅
│   ├── entities/
│   │   └── user.entity.ts        ✅
│   ├── users.controller.ts       ✅
│   ├── users.service.ts          ✅
│   └── users.module.ts           ✅
├── common/
│   └── enums/
│       └── user-type.enum.ts     ✅
├── scripts/
│   └── create-admin.ts           ✅
├── app.controller.ts             ✅
├── app.service.ts                ✅
├── app.module.ts                 ✅
└── main.ts                       ✅
```

## Technologies Used

- **NestJS** - Progressive Node.js framework ✅
- **TypeScript** - Type-safe JavaScript ✅
- **TypeORM** - Database ORM ✅
- **PostgreSQL** - Database ✅
- **bcrypt** - Password hashing ✅
- **class-validator** - Input validation ✅
- **JWT** - JSON Web Tokens ✅
- **@nestjs/jwt** - JWT integration ✅
- **Swagger** - API documentation (planned)

## Current Progress: 90% Complete

```
Phase 1: Basic CRUD         ██████████ 100% ✅
Phase 2: Database Setup     ██████████ 100% ✅
Phase 3: Validation         ██████████ 100% ✅
Phase 4: Authentication     ██████████ 100% ✅
Phase 5: Authorization      ██████████ 100% ✅
Phase 6: Documentation      ░░░░░░░░░░   0% 📋
```

## Next Steps

1. **API Documentation** - Swagger integration
2. **Testing** - Unit and E2E tests
3. **Enhanced Error Handling** - Custom exception filters

## Learning Notes

This project demonstrates:

- ✅ **NestJS Module Architecture** - Proper separation of concerns
- ✅ **TypeORM Integration** - Entity design and database operations
- ✅ **DTO Pattern** - Request/response validation and transformation
- ✅ **Service Layer** - Business logic separation
- ✅ **Password Security** - Proper hashing implementation
- ✅ **Authentication Flow** - JWT implementation with bcrypt validation
- ✅ **Guards Implementation** - Route protection and user extraction
- ✅ **TypeScript Types** - Custom interfaces for request handling
- ✅ **Authorization Patterns** - Role-based access control with custom decorators
- ✅ **Error Handling** - Proper HTTP exceptions and status codes
- ✅ **Database Seeding** - Automated admin user creation

## Authentication & Authorization Flow

1. **Admin Setup** - Run seeder script to create initial admin user
2. **User Registration** - Admin creates users via protected endpoint
3. **User Login** - Validate credentials with bcrypt comparison
4. **JWT Generation** - Create signed token with user payload including role
5. **Token Validation** - AuthGuard extracts and validates JWT
6. **Role Authorization** - RolesGuard checks user permissions
7. **Protected Routes** - Access based on user roles and authentication

## Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Security** - Secure token generation and validation
- ✅ **Role-based Access Control** - Admin, User, and Moderator roles
- ✅ **Route Protection** - Authentication and authorization guards
- ✅ **Input Validation** - DTO validation with class-validator
- ✅ **Error Handling** - Proper HTTP status codes and exception handling

## Getting Started

1. **Setup Database** - Configure PostgreSQL connection
2. **Install Dependencies** - `npm install`
3. **Create Admin** - `npm run seed:admin`
4. **Start Server** - `npm run start:dev`
5. **Login as Admin** - Use admin@example.com / admin123
6. **Create Users** - Use admin token to create additional users

## Commits & Progress Tracking

- ✅ Initial NestJS setup and project structure
- ✅ User entity and database configuration
- ✅ CRUD operations implementation
- ✅ Password hashing and validation
- ✅ User types enum implementation
- ✅ JWT authentication setup and implementation
- ✅ Authentication guards and route protection
- ✅ Login endpoint with token generation
- ✅ Protected user info endpoint
- ✅ Role-based authorization implementation
- ✅ Custom roles decorator and roles guard
- ✅ Admin-only and role-specific endpoints
- ✅ Database seeding for admin user
- ✅ Proper error handling with HTTP exceptions, not entirely done
- 🔄 API documentation with Swagger (next)

## License

This project is for learning purposes only and is not intended for production use.

---

**Note**: This is a study project. The focus is on learning NestJS patterns, authentication flows, authorization patterns, and security best practices. Always follow security guidelines when implementing authentication and authorization in production applications.
