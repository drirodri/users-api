import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserType } from '../common/enums/user-type.enum';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5433'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
  synchronize: false,
  logging: true,
});

async function createAdmin() {
  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = userRepository.create({
        name: 'System Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserType.ADMIN,
      });

      await userRepository.save(admin);
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

void createAdmin();
