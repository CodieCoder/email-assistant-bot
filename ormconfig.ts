import { DataSource, DataSourceOptions } from 'typeorm';
import POSTGRES_DB_CONFIG from './src/config/database/postgres.config.database';

const dataSourceOptions: DataSourceOptions = {
  ...POSTGRES_DB_CONFIG(),
  synchronize: false, //ALWAYS FALSE
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
