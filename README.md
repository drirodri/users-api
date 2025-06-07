# Users API - Authentication & Authorization Study Project

<p align="center">
  A NestJS learning project focused on implementing authentication, authorization, and user management features with clean architecture principles.
</p>

## Description

This repository contains a **study project** built with [NestJS](https://github.com/nestjs/nest) to learn and practice:

- 🔐 **Authentication** (Login/JWT) - ✅ **Completed**
- 🛡️ **Authorization** (Role-based access control) - ✅ **Completed**
- 👤 **User Management** (CRUD operations) - ✅ **Completed**
- 🔑 **JWT Token handling** - ✅ **Completed**
- 🔒 **Password hashing and security** - ✅ **Completed**
- 🛠️ **Guards, Decorators, and Clean Architecture** - ✅ **Completed**
- 🏗️ **Repository Pattern & Dependency Injection** - ✅ **Completed**
- 📬 **API Request Collections** - ✅ **Completed**
- 🧪 **Comprehensive Unit Testing** - ✅ **Completed**
- 📚 **Swagger/OpenAPI Documentation** - ✅ **Completed**

## Learning Objectives Achieved ✅

- ✅ Understand NestJS project structure and modules
- ✅ Practice TypeScript and NestJS best practices
- ✅ Learn database integration with TypeORM
- ✅ Implement input validation with DTOs
- ✅ Handle password encryption with bcrypt
- ✅ Understand JWT authentication flow
- ✅ Implement role-based authorization
- ✅ Learn NestJS decorators and guards
- ✅ Apply SOLID principles and clean architecture
- ✅ Implement Repository pattern for data access
- ✅ Create API request collections for manual testing
- ✅ Write comprehensive unit tests with Jest
- ✅ Mock dependencies and test edge cases
- ✅ Document APIs with Swagger/OpenAPI

## Current Features ✅

### Core Functionality

- 👤 **Complete User Management** - CRUD operations with role-based access
- 🗄️ **Database Integration** - PostgreSQL with TypeORM and custom repositories
- 🔒 **Password Security** - bcrypt hashing with crypto helper service
- ✅ **Input Validation** - DTOs with class-validator and comprehensive error handling
- 🏷️ **User Roles** - Enum-based system (Admin, User, Moderator)
- 📝 **Clean Entity Design** - Proper TypeORM entities with timestamps

### Authentication & Authorization

- 🔐 **JWT Authentication** - Secure login with email/password
- 🛡️ **Route Protection** - Authentication and authorization guards
- 🔑 **Token Validation** - JWT verification with user extraction
- 🎯 **Role-Based Authorization** - Admin-only and role-specific endpoints
- 👤 **Current User Decorator** - Easy access to authenticated user data
- 🚫 **Permission Validation** - Users can only update their own profiles

### Architecture & Code Quality

- 🏗️ **Repository Pattern** - Clean data access layer
- 🔧 **Service Layer Separation** - Business logic, validation, and crypto helpers
- 📦 **Dependency Injection** - Proper NestJS module system
- 🎯 **Custom Decorators** - @Roles() and @CurrentUser() decorators
- 🛡️ **Guards Implementation** - AuthGuard and RolesGuard
- ⚡ **Error Handling** - Comprehensive exception handling

### API Documentation

- 📚 **Swagger/OpenAPI Integration** - Automated API docs with DTO schemas, enums, and error responses
- 🏷️ **Custom Decorators for Swagger** - DRY and consistent documentation for all endpoints
- 📝 **Enum and DTO Schemas** - All DTOs and enums are fully documented in Swagger UI

### Testing & Quality Assurance

- 🧪 **Unit Testing** - Comprehensive Jest test suite for controllers
- 🔍 **Test Coverage** - Coverage reporting for code quality metrics
- 🎭 **Mocking Strategy** - Proper service and dependency mocking
- 🛡️ **Guard Testing** - Authentication and authorization guard testing
- ⚠️ **Error Testing** - Edge cases and error scenario validation
- 📊 **Code Quality** - ESLint, Prettier, and TypeScript strict mode

### Development Tools

- 🛠️ **Database Seeding** - Admin user creation script
- 📋 **Environment Configuration** - Proper config management
- 🔧 **Development Tools** - ESLint, Prettier, TypeScript strict mode
- 📬 **Bruno Collections** - Complete API request collections for manual testing
- 🧪 **Jest Testing Framework** - Unit testing with coverage reporting

## API Endpoints

### Authentication ✅

```
POST   /auth/login      # User login (returns JWT token)
GET    /auth/me         # Get current user info (protected, requires JWT)
```

### Users Management (Protected Routes) ✅

```
GET    /users           # Get all users (Admin only)
GET    /users/:id       # Get user by ID (Admin only)
POST   /users           # Create new user (Admin only)
PATCH  /users/:id       # Update user (Admin/Owner only)
DELETE /users/:id       # Delete user (Admin only)
```

### Admin Setup ✅

```bash
npm run seed:admin      # Create initial admin user
```

## API Documentation

- **Swagger UI available at:** `http://localhost:3000/api`
- All endpoints, DTOs, enums, and error responses are fully documented.
- Custom decorators are used for DRY and consistent Swagger docs.

## Testing

### Running Tests ✅

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test users.controller.spec.ts
```

### Test Coverage ✅

The project includes comprehensive unit tests covering:

- **Controller Testing** - All CRUD operations and authentication flows
- **Error Handling** - Exception scenarios and edge cases
- **Authorization** - Role-based access control validation
- **Input Validation** - DTO validation and malformed data handling
- **Guard Testing** - Authentication and authorization guard mocking
- **Service Mocking** - Proper dependency injection testing

### Test Structure

```
src/
├── users/
│   └── users.controller.spec.ts    ✅ Comprehensive controller tests
├── app.controller.spec.ts           ✅ Basic application tests
└── **/*.spec.ts                     ✅ Test files following NestJS conventions
```

## Project Architecture

```
src/
├── auth/                           ✅ Complete Auth Module
│   ├── guards/
│   │   ├── auth.guard.ts          # JWT token validation
│   │   └── roles.guard.ts         # Role-based access control
│   ├── types/
│   │   └── auth.types.ts          # Type definitions
│   ├── auth.controller.ts         # Login & user info endpoints
│   ├── auth.service.ts            # Authentication logic
│   ├── auth.module.ts             # Module configuration
│   ├── roles.decorator.ts         # Custom @Roles() decorator
│   └── user.decorator.ts          # Custom @CurrentUser() decorator
├── users/                          ✅ Complete Users Module
│   ├── dto/
│   │   ├── create-user.dto.ts     # User creation validation
│   │   ├── update-user.dto.ts     # User update validation
│   │   └── user-response.dto.ts   # Response serialization
│   ├── entities/
│   │   └── user.entity.ts         # User database entity
│   ├── repositories/
│   │   └── users.repository.ts    # Data access layer
│   ├── validators/
│   │   └── user.validator.ts      # Business validation logic
│   ├── users.controller.ts        # HTTP endpoints
│   ├── users.controller.spec.ts   # ✅ Comprehensive unit tests
│   ├── users.service.ts           # Business logic
│   └── users.module.ts            # Module configuration
├── common/                         ✅ Shared Components
│   ├── enums/
│   │   └── user-type.enum.ts      # User role definitions
│   ├── decorators/
│   │   └── api-responses.decorator.ts # Custom Swagger decorators
│   │   └── api-auth-responses.decorator.ts # Auth Swagger decorators
│   └── helpers/
│       └── crypto.helper.ts       # Password hashing utility
├── scripts/                        ✅ Database Scripts
│   └── create-admin.ts            # Admin user seeding
└── bruno/                          ✅ API Request Collections
    └── users-api-requests/
        ├── Auth/                   # Authentication requests
        └── Users/                  # User management requests
```

## Technologies & Patterns Used

### Core Technologies ✅

- **NestJS** - Progressive Node.js framework with decorators
- **TypeScript** - Type-safe JavaScript with strict mode
- **TypeORM** - Object-relational mapping with PostgreSQL
- **PostgreSQL** - Relational database
- **bcrypt** - Password hashing algorithm
- **JWT** - JSON Web Tokens for authentication
- **class-validator** - Input validation with decorators
- **@nestjs/swagger** - Automated API documentation

### Testing Technologies ✅

- **Jest** - JavaScript testing framework with TypeScript support
- **@nestjs/testing** - NestJS testing utilities and module mocking
- **Supertest** - HTTP assertion library for E2E testing
- **Coverage Reporting** - Code coverage analysis and reporting

### Architecture Patterns ✅

- **Repository Pattern** - Clean data access abstraction
- **Service Layer Pattern** - Business logic separation
- **Dependency Injection** - IoC container for loose coupling
- **Guard Pattern** - Route protection and authorization
- **Decorator Pattern** - Custom decorators for metadata
- **DTO Pattern** - Data transfer objects for validation

### Development Tools ✅

- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Bruno** - API request collections for manual testing
- **ts-node** - TypeScript execution for scripts

## Security Features ✅

### Authentication Security

- ✅ **Password Hashing** - bcrypt with configurable salt rounds
- ✅ **JWT Security** - Secure token generation and validation
- ✅ **Token Extraction** - Proper authorization header parsing
- ✅ **User Context** - Secure user data extraction from tokens

### Authorization Security

- ✅ **Role-Based Access Control** - Admin, User, and Moderator roles
- ✅ **Route Protection** - Guards on all sensitive endpoints
- ✅ **Permission Validation** - Users can only modify their own data
- ✅ **Admin Privileges** - Separate admin-only operations

### Input Security

- ✅ **Input Validation** - Comprehensive DTO validation
- ✅ **Type Safety** - TypeScript strict mode enabled
- ✅ **Sanitization** - Whitelist and forbid non-whitelisted properties
- ✅ **Error Handling** - Proper HTTP status codes and messages

## Getting Started

### 1. **Environment Setup**

```bash
# Install dependencies
npm install

# Configure database (PostgreSQL)
# Create .env file with database credentials
```

### 2. **Database Setup**

```bash
# Create admin user
npm run seed:admin
```

### 3. **Start Development**

```bash
# Start in development mode
npm run start:dev

# API will be available at http://localhost:3000
# Swagger docs at http://localhost:3000/api
```

### 4. **Testing**

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### 5. **API Testing**

```bash
# Open Bruno and import the collection from /bruno folder
# Test endpoints in this order:
1. Auth/login.bru          # Get authentication token
2. Users/get-all-users.bru # Test protected routes
3. Users/create-user.bru   # Test admin operations
```

## Bruno API Collections ✅

The project includes a complete set of API request collections built with Bruno for manual testing:

### Available Collections

- **Authentication Requests** - Login and user info endpoints
- **User Management Requests** - Complete CRUD operations
- **Authorization Tests** - Role-based access validation
- **Error Handling Examples** - Invalid requests and edge cases

### Usage Flow

1. **Login** - Get JWT token for admin user
2. **User Operations** - Test all CRUD operations
3. **Permission Tests** - Verify role-based restrictions
4. **Error Cases** - Test validation and error handling

**Note**: These are request collections for manual testing, complementing the automated unit tests.

## Project Status: 100% Complete ✅

```
Phase 1: Basic CRUD             ██████████ 100% ✅
Phase 2: Database & Validation  ██████████ 100% ✅
Phase 3: Authentication         ██████████ 100% ✅
Phase 4: Authorization          ██████████ 100% ✅
Phase 5: Clean Architecture     ██████████ 100% ✅
Phase 6: API Collections        ██████████ 100% ✅
Phase 7: Unit Testing           ██████████ 100% ✅
Phase 8: Documentation          ██████████ 100% ✅
```

## Achievements & Learning Outcomes ✅

### Technical Skills Mastered

- ✅ **NestJS Architecture** - Complete understanding of modules, controllers, services
- ✅ **TypeScript Patterns** - Advanced types, decorators, and strict typing
- ✅ **Database Design** - Entity relationships and repository patterns
- ✅ **Security Implementation** - Authentication, authorization, and data protection
- ✅ **Clean Code Practices** - SOLID principles and separation of concerns
- ✅ **API Design** - RESTful endpoints with proper HTTP semantics
- ✅ **Testing Strategies** - Unit testing, mocking, and coverage analysis
- ✅ **API Documentation** - Automated and DRY Swagger docs

## License

This project is for educational purposes only and demonstrates best practices for NestJS authentication and authorization systems.

---

**Note**: This is a comprehensive study project showcasing production-ready NestJS patterns for authentication, authorization, and clean architecture. The implementation follows industry best practices with complete unit test coverage and can serve as a reference for building secure Node.js applications.
