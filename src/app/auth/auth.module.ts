import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user';
import { AuthService } from './auth.service';
import { AuthController } from './';
import { UserService } from '../user';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getEnvVar } from 'src/config/global';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'src/lib/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: getEnvVar('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
        global: true,
      }),
    }),

    LoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    UserService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
