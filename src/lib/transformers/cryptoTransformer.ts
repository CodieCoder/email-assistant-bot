import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';
import { getEnvVar } from 'src/config/global';

export const cryptoTransformer: ValueTransformer = {
  to(value: string) {
    const PUBLIC_KEY = getEnvVar('PUBLIC_KEY');

    return crypto
      .publicEncrypt(PUBLIC_KEY, Buffer.from(value))
      .toString('base64');
  },
  from(value: string) {
    const PRIVATE_KEY = getEnvVar('PRIVATE_KEY');

    return crypto
      .privateDecrypt(PRIVATE_KEY, Buffer.from(value, 'base64'))
      .toString();
  },
};
