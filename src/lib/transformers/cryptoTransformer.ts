import { ValueTransformer } from 'typeorm';
import { publicEncrypt, privateDecrypt } from 'node:crypto';
import { getEnvVar } from 'src/config/global';

const decodeKey = (key: string) => Buffer.from(key, 'base64').toString();

export const cryptoTransformer: ValueTransformer = {
  to: (value: string) => {
    const publicKey = getEnvVar('CRYPTO_PUBLIC_KEY');
    //decode from base64
    const encrypted = publicEncrypt(decodeKey(publicKey), Buffer.from(value));
    return encrypted.toString('base64');
  },
  from: (value: string) => {
    const privateKey = getEnvVar('CRYPTO_PRIVATE_KEY');
    const decrypted = privateDecrypt(
      decodeKey(privateKey),
      Buffer.from(value, 'base64'),
    );
    return decrypted.toString();
  },
};
