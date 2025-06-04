import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UserValidator } from './validators/user.validator';
import { CryptoHelper } from '../common/helpers/crypto.helper';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserValidator, CryptoHelper],
  exports: [UsersService],
})
export class UsersModule {}
