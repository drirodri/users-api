import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserType } from '../common/enums/user-type.enum';
import { User } from '../users/entities/user.entity';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserType.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdmin: User = {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedAdminPassword',
    role: UserType.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCurrentUser = {
    userId: '1',
    email: 'test@example.com',
    role: UserType.USER,
  };

  const mockAdminUser = {
    userId: '2',
    email: 'admin@example.com',
    role: UserType.ADMIN,
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      role: UserType.USER,
    };

    it('should create a user successfully', async () => {
      const expectedUser = { ...mockUser, ...createUserDto };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result.message).toBe('User created successfully');
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(createUserDto.name);
      expect(result.data.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException when user already exists', async () => {
      mockUsersService.create.mockRejectedValue(
        new ConflictException('User already exists'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        name: '',
        email: 'invalid-email',
        password: '123',
        role: 'INVALID_ROLE' as UserType,
      };

      mockUsersService.create.mockRejectedValue(
        new ConflictException('Validation failed'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle database connection errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserType.USER,
      };

      mockUsersService.create.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [mockUser, mockAdmin];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result.message).toBe('Users retrieved successfully');
      expect(result.count).toBe(2);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].email).toBe(mockUser.email);
      expect(result.data[1].email).toBe(mockAdmin.email);
    });

    it('should return empty array when no users found', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result.message).toBe('Users retrieved successfully');
      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should handle large datasets', async () => {
      const largeUserArray = Array.from({ length: 1000 }, (_, i) => ({
        ...mockUser,
        id: i + 1,
        email: `user${i}@example.com`,
      }));

      mockUsersService.findAll.mockResolvedValue(largeUserArray);

      const result = await controller.findAll();

      expect(result.count).toBe(1000);
      expect(result.data).toHaveLength(1000);
    });

    it('should handle service errors', async () => {
      mockUsersService.findAll.mockRejectedValue(
        new Error('Database query failed'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Database query failed',
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id successfully', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
      expect(result.name).toBe(mockUser.name);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should convert string id to number', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await controller.findOne('123');

      expect(mockUsersService.findOne).toHaveBeenCalledWith(123);
    });

    it('should handle invalid id formats', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('Invalid ID format'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle negative ids', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findOne('-1')).rejects.toThrow(NotFoundException);
    });

    it('should handle very large ids', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findOne('999999999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      role: UserType.MODERATOR,
    };

    it('should update user successfully as admin', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto, mockAdminUser);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        1,
        updateUserDto,
        mockAdminUser,
      );
      expect(result.message).toBe('User updated successfully');
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(updateUserDto.name);
    });

    it('should update own profile successfully as regular user', async () => {
      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
        role: UserType.USER,
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateDto, mockCurrentUser);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        1,
        updateDto,
        mockCurrentUser,
      );
      expect(result.message).toBe('User updated successfully');
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('Updated Name');
    });

    it('should throw ForbiddenException when user tries to update another user', async () => {
      mockUsersService.update.mockRejectedValue(
        new ForbiddenException('You can only update your own profile'),
      );

      await expect(
        controller.update('2', updateUserDto, mockCurrentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when regular user tries to change role', async () => {
      mockUsersService.update.mockRejectedValue(
        new ForbiddenException('Only administrators can change user roles'),
      );

      const roleChangeDto: UpdateUserDto = {
        name: 'Test User',
        role: UserType.ADMIN,
      };

      await expect(
        controller.update('1', roleChangeDto, mockCurrentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when user to update not found', async () => {
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.update('999', updateUserDto, mockAdminUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdateUserDto = {
        name: 'Only Name Updated',
        role: UserType.USER,
      };

      const updatedUser = { ...mockUser, name: 'Only Name Updated' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        '1',
        partialUpdateDto,
        mockCurrentUser,
      );

      expect(result.data.name).toBe('Only Name Updated');
      expect(result.data.email).toBe(mockUser.email); // unchanged
    });

    it('should handle role escalation attempts', async () => {
      const escalationDto: UpdateUserDto = {
        name: 'Hacker',
        role: UserType.ADMIN,
      };

      mockUsersService.update.mockRejectedValue(
        new ForbiddenException('Cannot escalate privileges'),
      );

      await expect(
        controller.update('1', escalationDto, mockCurrentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should handle concurrent update attempts', async () => {
      mockUsersService.update.mockRejectedValue(
        new ConflictException('User was modified by another process'),
      );

      await expect(
        controller.update(
          '1',
          { name: 'New Name', role: UserType.USER },
          mockCurrentUser,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle updates with same data', async () => {
      const sameDataDto: UpdateUserDto = {
        name: mockUser.name,
        role: mockUser.role,
      };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', sameDataDto, mockCurrentUser);

      expect(result.message).toBe('User updated successfully');
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(mockUser.id);
      expect(result.data.name).toBe(mockUser.name);
      expect(result.data.email).toBe(mockUser.email);
      expect(result.data.role).toBe(mockUser.role);
      expect(result.data.createdAt).toEqual(mockUser.createdAt);
      expect(result.data.updatedAt).toEqual(mockUser.updatedAt);
      // Password should be excluded from response
      expect(result.data.password).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
      expect(result.message).toBe('User removed successfully');
    });

    it('should throw NotFoundException when user to delete not found', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });

    it('should convert string id to number for deletion', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('123');

      expect(mockUsersService.remove).toHaveBeenCalledWith(123);
    });

    it('should handle removal of non-existent user', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });

    it('should handle removal of admin user', async () => {
      mockUsersService.remove.mockRejectedValue(
        new ForbiddenException('Cannot delete admin user'),
      );

      await expect(controller.remove('2')).rejects.toThrow(ForbiddenException);
    });

    it('should handle database constraints', async () => {
      mockUsersService.remove.mockRejectedValue(
        new ConflictException('User has associated records'),
      );

      await expect(controller.remove('1')).rejects.toThrow(ConflictException);
    });

    it('should handle zero id', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('Invalid user ID'),
      );

      await expect(controller.remove('0')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string parameters', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('Invalid ID'),
      );

      await expect(controller.findOne('')).rejects.toThrow(NotFoundException);
    });

    it('should handle invalid/empty data in DTOs', async () => {
      const invalidDto: CreateUserDto = {
        name: '',
        email: '',
        password: '',
        role: UserType.USER,
      };

      mockUsersService.create.mockRejectedValue(
        new ConflictException('Invalid data: name and email are required'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle special characters in names', async () => {
      const specialCharDto: CreateUserDto = {
        name: 'José María Özbek-Çelik',
        email: 'special@example.com',
        password: 'password123',
        role: UserType.USER,
      };

      const expectedUser = { ...mockUser, ...specialCharDto };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(specialCharDto);

      expect(result.data.name).toBe('José María Özbek-Çelik');
    });
  });

  describe('Different User Roles', () => {
    const mockModerator: User = {
      ...mockUser,
      id: 3,
      role: UserType.MODERATOR,
      email: 'moderator@example.com',
    };

    const mockModeratorUser = {
      userId: '3',
      email: 'moderator@example.com',
      role: UserType.MODERATOR,
    };

    it('should handle moderator operations', async () => {
      const updateDto: UpdateUserDto = {
        name: 'Updated by Moderator',
        role: UserType.USER,
      };

      const updatedUser = { ...mockUser, name: 'Updated by Moderator' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateDto, mockModeratorUser);

      expect(result.data.name).toBe('Updated by Moderator');
    });

    it('should create moderator users', async () => {
      const createModeratorDto: CreateUserDto = {
        name: 'New Moderator',
        email: 'newmod@example.com',
        password: 'password123',
        role: UserType.MODERATOR,
      };

      const expectedUser = { ...mockModerator, ...createModeratorDto };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createModeratorDto);

      expect(result.data.role).toBe(UserType.MODERATOR);
    });
  });
});
