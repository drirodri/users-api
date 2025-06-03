import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthInput = {
  email: string;
  password: string;
};
type SignInData = {
  userId: number;
  email: string;
};
type AuthResult = {
  accessToken: string;
  userId: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async authenticate(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: 'tested_token', // This should be replaced with actual token generation logic
      userId: user.userId,
      email: user.email,
    };
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findByEmail(input.email);
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        userId: user.id,
        email: user.email,
      };
    }
    return null;
  }
}
