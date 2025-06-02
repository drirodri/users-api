# Users API - Authentication & Authorization Study Project

<p align="center">
  A NestJS learning project focused on implementing authentication, authorization, and user management features.
</p>

## Description

This repository contains a **study project** built with [NestJS](https://github.com/nestjs/nest) to learn and practice:

- 🔐 **Authentication** (Login/Register) - _In Progress_
- 🛡️ **Authorization** (Role-based access control) - _Planned_
- 👤 **User Management** (CRUD operations) - ✅ **Completed**
- 🔑 **JWT Token handling** - _Planned_
- 🔒 **Password hashing and security** - ✅ **Completed**
- 🛠️ **Guards, Pipes, and Interceptors** - _In Progress_
- 📚 **API Documentation with Swagger** - _Planned_

## Learning Objectives

- ✅ Understand NestJS project structure and modules
- ✅ Practice TypeScript and NestJS best practices
- ✅ Learn database integration with TypeORM
- ✅ Implement input validation with DTOs
- ✅ Handle password encryption with bcrypt
- 🔄 Understand JWT authentication flow
- 🔄 Implement role-based authorization
- 🔄 Learn NestJS decorators and guards
- 🔄 Handle validation and error management
- 🔄 Generate comprehensive API documentation with Swagger

## Current Features ✅

- 👤 **User CRUD Operations** - Complete user management
- 🗄️ **Database Integration** - PostgreSQL with TypeORM
- 🔒 **Password Security** - bcrypt hashing implementation
- ✅ **Input Validation** - DTOs with class-validator
- 🏷️ **User Types** - Enum-based user roles (Admin, User, Moderator)
- 📝 **Proper Entity Design** - TypeORM entities with relationships

## Planned Features 🔄

- 🔐 JWT authentication system
- 🛡️ Route protection with Guards
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

### Authentication (Planned)

```
POST   /auth/register   # User registration
POST   /auth/login      # User login
POST   /auth/refresh    # Refresh JWT token
```

## Current Project Structure

```
src/
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
- **JWT** - JSON Web Tokens (planned)
- **Swagger** - API documentation (planned)

## Current Progress: 50% Complete

```
Phase 1: Basic CRUD         ██████████ 100% ✅
Phase 2: Database Setup     ██████████ 100% ✅
Phase 3: Validation         ██████████ 100% ✅
Phase 4: Authentication     ░░░░░░░░░░   0% 🔄
Phase 5: Authorization      ░░░░░░░░░░   0% 📋
Phase 6: Documentation      ░░░░░░░░░░   0% 📋
```

## Next Steps

1. **Authentication Implementation** - JWT setup and login/register endpoints
2. **Route Protection** - Guards and middleware implementation
3. **Role-based Authorization** - Admin/User access control
4. **API Documentation** - Swagger integration
5. **Testing** - Unit and E2E tests

## Study Resources

- [NestJS Authentication Documentation](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [TypeORM Documentation](https://typeorm.io/)
- [Password Security](https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Learning Notes

This project demonstrates:

- ✅ **NestJS Module Architecture** - Proper separation of concerns
- ✅ **TypeORM Integration** - Entity design and database operations
- ✅ **DTO Pattern** - Request/response validation and transformation
- ✅ **Service Layer** - Business logic separation
- ✅ **Password Security** - Proper hashing implementation
- 🔄 **Authentication Flow** - JWT implementation (in progress)
- 📋 **Authorization Patterns** - Role-based access control (planned)

## Commits & Progress Tracking

- ✅ Initial NestJS setup and project structure
- ✅ User entity and database configuration
- ✅ CRUD operations implementation
- ✅ Password hashing and validation
- ✅ User types enum implementation
- 🔄 JWT authentication setup (next)

## License

This project is for learning purposes only and is not intended for production use.

---

**Note**: This is a study project. The focus is on learning NestJS patterns, authentication flows, and security best practices. Always follow security guidelines when implementing authentication in production applications.
