import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './types/auth.types';

export const CurrentUser = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user ?? null;
});
