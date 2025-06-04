import { Request } from 'express';
import { UserType } from 'src/common/enums/user-type.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserType;
}

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserType;
  };
}
