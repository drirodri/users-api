import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserResponseDto } from '../../users/dto/user-response.dto';

export const ApiStandardResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Authentication required',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['Validation failed'],
          error: 'Bad Request',
        },
      },
    }),
  );

export const ApiAdminOnlyResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiStandardResponses(),
    ApiForbiddenResponse({
      description: 'Admin access required',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
        },
      },
    }),
  );

export const ApiUserCrudResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiAdminOnlyResponses(),
    ApiNotFoundResponse({
      description: 'User not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User not found',
        },
      },
    }),
  );

export const ApiCreateUserResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiExtraModels(UserResponseDto),
    ApiOkResponse({
      description: 'User created successfully',
      type: UserResponseDto,
    }),
    ApiConflictResponse({
      description: 'User already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'User already exists',
        },
      },
    }),
    ApiAdminOnlyResponses(),
  );

export const ApiUpdateUserResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiExtraModels(UserResponseDto),
    ApiOkResponse({
      description: 'User updated successfully',
      type: UserResponseDto,
    }),
    ApiConflictResponse({
      description: 'Invalid update data',
      schema: {
        example: {
          statusCode: 409,
          message: 'New password cannot be the same as the old one',
        },
      },
    }),
    ApiUserCrudResponses(),
  );

export const ApiGetAllUsersResponses = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiExtraModels(UserResponseDto),
    ApiOkResponse({
      description: 'Users retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Users retrieved successfully',
          },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserResponseDto' },
          },
          count: { type: 'number', example: 1 },
        },
      },
    }),
    ApiAdminOnlyResponses(),
  );
