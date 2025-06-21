import { DataSourceOptions } from 'typeorm';

const POSTGRES_DB_CONFIG: () => DataSourceOptions = () => ({
  type: 'postgres',
  // host: process.env.POSTGRES_HOST,
  // port: parseInt(process.env.POSTGRES_PORT || '5432'),
  // username: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DB,
  url: process.env.POSTGRES_DATABASE_URL,
  synchronize: false, // DON'T EVER CHANGE THIS!!!!
  logging: false,
  // entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  useUTC: true,
  autoLoadEntities: true,
});

export default POSTGRES_DB_CONFIG;
