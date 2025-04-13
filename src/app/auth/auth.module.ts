import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getEnvVar } from 'src/config/global';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: Logger,
      useClass: Logger,
    },
    AuthService,
    UserService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
