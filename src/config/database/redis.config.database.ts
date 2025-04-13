import { RedisOptions } from 'ioredis';
import { getEnvVar } from '../global';

export const REDIS_DB_CONFIG = () => {
  const config: RedisOptions = {
    host: getEnvVar('REDIS_HOST'),
    port: parseInt(getEnvVar('REDIS_PORT')),
    password: getEnvVar('REDIS_PASSWORD'),
    // db: parseInt(getEnvVar('REDIS_DB')),
    username: getEnvVar('REDIS_USERNAME'),
  };

  return config;
};
