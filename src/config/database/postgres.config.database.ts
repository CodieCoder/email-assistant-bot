import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const POSTGRES_DB_CONFIG: () => TypeOrmModuleOptions = () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  // entities: ['src/entities/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  useUTC: true,
  autoLoadEntities: true,
});

export default POSTGRES_DB_CONFIG;
