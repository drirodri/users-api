# Users API - Authentication & Authorization Study Project

<p align="center">
  A NestJS learning project focused on implementing authentication, authorization, and user management features.
</p>

## Description

This repository contains a **study project** built with [NestJS](https://github.com/nestjs/nest) to learn and practice:

- 🔐 **Authentication** (Login/Register) - ✅ **Completed**
- 🛡️ **Authorization** (Role-based access control) - _Planned_
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
- 🔄 Implement role-based authorization
- ✅ Learn NestJS decorators and guards
- 🔄 Handle validation and error management
- 🔄 Generate comprehensive API documentation with Swagger

## Current Features ✅

- 👤 **User CRUD Operations** - Complete user management
- 🗄️ **Database Integration** - PostgreSQL with TypeORM
- 🔒 **Password Security** - bcrypt hashing implementation
- ✅ **Input Validation** - DTOs with class-validator
- 🏷️ **User Types** - Enum-based user roles (Admin, User, Moderator)
- 📝 **Proper Entity Design** - TypeORM entities with relationships
- 🔐 **JWT Authentication** - Login with email/password
- 🛡️ **Route Protection** - Authentication guards implemented
- 🔑 **Token Validation** - JWT token verification and user extraction

## Planned Features 🔄

- 🎯 Role-based access control
- 📋 Comprehensive error handling
- 📚 Swagger API documentation
- 🧪 Unit and integration tests

## API Endpoints

### Users Management

```
GET    /users           # Get all users
GET    /users/:id       # Get user by ID
POST   /users           # Create new user
PATCH  /users/:id       # Update user
DELETE /users/:id       # Delete user
```

### Authentication ✅

```
POST   /auth/login      # User login (returns JWT token)
GET    /auth/me         # Get current user info (protected)
```

## Current Project Structure

```
src/
├── auth/
│   ├── guards/
│   │   └── auth.guard.ts         ✅
│   ├── types/
│   │   └── auth.types.ts         ✅
│   ├── auth.controller.ts        ✅
│   ├── auth.service.ts           ✅
│   └── auth.module.ts            ✅
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts    ✅
│   │   ├── update-user.dto.ts    ✅
│   │   └── user-response.dto.ts  ✅
│   ├── entities/
│   │   └── user.entity.ts        ✅
│   ├── enums/
│   │   └── user-type.enum.ts     ✅
│   ├── users.controller.ts       ✅
│   ├── users.service.ts          ✅
│   └── users.module.ts           ✅
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

## Current Progress: 75% Complete

```
Phase 1: Basic CRUD         ██████████ 100% ✅
Phase 2: Database Setup     ██████████ 100% ✅
Phase 3: Validation         ██████████ 100% ✅
Phase 4: Authentication     ██████████ 100% ✅
Phase 5: Authorization      ░░░░░░░░░░   0% 📋
Phase 6: Documentation      ░░░░░░░░░░   0% 📋
```

## Next Steps

1. **Role-based Authorization** - Admin/User access control
2. **API Documentation** - Swagger integration
3. **Testing** - Unit and E2E tests
4. **Enhanced Error Handling** - Custom exception filters

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
- 📋 **Authorization Patterns** - Role-based access control (planned)

## Authentication Flow

1. **User Registration** - Create user with hashed password
2. **User Login** - Validate credentials with bcrypt comparison
3. **JWT Generation** - Create signed token with user payload
4. **Token Validation** - Guard extracts and validates JWT
5. **Protected Routes** - Access user data from token payload

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
- 🔄 Role-based authorization (next)

## License

This project is for learning purposes only and is not intended for production use.

---

**Note**: This is a study project. The focus is on learning NestJS patterns, authentication flows, and security best practices. Always follow security guidelines when implementing authentication in production applications.
