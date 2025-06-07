import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';

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
