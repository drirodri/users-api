import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from 'src/auth/dto/register-response.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;
}

export class MeResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class RefreshResponseDto {
  @ApiProperty({ description: 'New access token' })
  accessToken: string;
}

export const ApiLoginOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticate user and return JWT token.',
    }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
      schema: {
        example: { statusCode: 401, message: 'Invalid email or password' },
      },
    }),
  );

export const ApiMeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get current user info',
      description:
        "Returns the authenticated user's info. Requires a valid JWT. ",
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Authenticated user info',
      type: MeResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: { example: { statusCode: 401, message: 'No token provided' } },
    }),
  );

export const ApiRefreshTokenOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description:
        'Generates a new access token using the refresh token stored in HTTP-only cookies. The new refresh token is automatically set as a cookie.',
    }),
    ApiResponse({
      status: 200,
      description: 'New access token generated successfully',
      type: RefreshResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid or missing refresh token',
      schema: {
        example: {
          statusCode: 401,
          message: 'No refresh token provided',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Refresh token validation failed',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid refresh token',
        },
      },
    }),
  );

export const ApiRegisterOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Public endpoint for user self-registration. Users are automatically assigned the USER role.',
    }),
    ApiBody({
      type: () => RegisterUserDto,
      examples: {
        'user-registration': {
          summary: 'User registration example',
          value: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'SecurePassword123!',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      type: RegisterResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be a valid email', 'password is too weak'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'User already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'User with this email already exists',
        },
      },
    }),
  );
