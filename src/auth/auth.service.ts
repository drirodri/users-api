import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/common/enums/user-type.enum';

type AuthInput = {
  email: string;
  password: string;
};
type SignInData = {
  userId: number;
  email: string;
  role: UserType;
};
export type AuthResult = {
  accessToken: string;
  userId: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findByEmail(input.email);
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      userId: user.userId,
      email: user.email,
    };
  }
}
