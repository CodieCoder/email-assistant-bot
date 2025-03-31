import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreatedDto, UserCreateDto, UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { getEnvVar } from 'src/config/global';
import { v4 as uuidv4 } from 'uuid';
import { CustomLoggerService } from 'src/lib/logger';

@Injectable()
export class UserService {
  private hashSalt: string;

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private readonly logger: CustomLoggerService,
  ) {
    const hashSalt = getEnvVar('HASH_SALT');
    if (!hashSalt) {
      throw new InternalServerErrorException('Internal server error.');
    }

    this.hashSalt = hashSalt;
  }

  /**
   * @description: Find user by email
   * @param email email address of the user
   * @returns UserDto | null
   */
  public async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const { password, ...userDetails } = user;

    return userDetails as UserDto;
  }

  /**
   * @description: Find user by email
   * @param email email address of the user
   * @returns UserDto | null
   */
  public async findOneById(id: string): Promise<UserDto | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    const { password, ...userDetails } = user;

    return userDetails as UserDto;
  }

  /**
   * @description Verifies a user by email and password
   * @param email email of the user
   * @param hashedPassword password (plain text) of the user
   * @returns
   */
  public async verifyUserWithEmailAndPassword(
    email: string,
    hashedPassword: string,
  ): Promise<UserDto | null> {
    try {
      const user = await this.userRepo.findOne({
        where: { email: email },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(
        hashedPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return null;
      }

      const { password, ...userDetails } = user;

      return userDetails as UserDto;
    } catch (error) {
      const message = 'Error verifying user.';
      this.logger.error({
        message,
        context: this.verifyUserWithEmailAndPassword.name,
      });
      throw new UnauthorizedException({ message });
    }
  }

  /**
   * Handles user creation.
   * @param userDto - The user registration details.
   * @returns The created user details without the password.
   * @throws ConflictException if the email is already in use.
   */
  public async create(userDto: UserCreateDto): Promise<UserCreatedDto> {
    const existingUser = await this.userRepo.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new BadRequestException({ message: 'This user already exist.' });
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    try {
      const user = this.userRepo.create({
        ...userDto,
        isEmailVerified: true, //change to false in production
        verificationToken: this.generateVerificationToken(),
        password: hashedPassword,
      });

      const savedUser = await this.userRepo.save(user);

      const { password, ...userDetails } = savedUser;
      return userDetails as UserCreatedDto;
    } catch (error) {
      let message = 'Error creating user';
      if (error.code === '23505') {
        throw new ConflictException({ message });
      }

      message = 'Error creating user';
      this.logger.log({ message, context: this.create.name });
      throw new BadRequestException({ message });
    }
  }

  public async update(userDto: UserCreateDto): Promise<UserDto> {
    const user = this.userRepo.create(userDto);

    const { password, ...userDetails } = user;

    return userDetails as UserDto;
  }

  /**
   * Generates a unique verification token using UUID v4.
   * @returns A unique verification token as a string.
   */
  private generateVerificationToken(): string {
    return uuidv4(); // Generates a UUID v4 token
  }

  /**
   * Hashes a password using bcrypt.
   * @param password - The plain text password.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = parseInt(this.hashSalt, 10);
      const salt = await bcrypt.genSalt(saltRounds);
      return bcrypt.hash(password, salt);
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Internal error occurred.',
      });
    }
  }
}
