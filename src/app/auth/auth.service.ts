import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IUserAuthResponse,
  IJwtPayload,
  UserCreatedDto,
  UserCreateDto,
  UserCreateResponseDto,
  UserDto,
  UserLoginDto,
} from '../user';
import { UserService } from '../user';
import { getEnvVar } from 'src/config/global';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Handles user login.
   * @param userDto - The login credentials.
   * @returns The user details and access token.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  public async login(userDto: UserLoginDto): Promise<IUserAuthResponse> {
    if (userDto.email?.length < 5 || userDto.password?.length <= 8) {
      throw new UnauthorizedException('Invalid email/password');
    }

    //verify user
    const user = await this.userService.verifyUserWithEmailAndPassword(
      userDto.email,
      userDto.password,
    );

    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    // Generate JWT access token
    const accessToken = await this.generateAccessToken(user.id, user.email);

    const dtoUser: Partial<UserDto> = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
    };

    const result = { user: dtoUser, accessToken };

    return result;
  }

  /**
   * @description Create a new user
   * @param userCreateDto - The user registration details.
   * @returns boolean. True if the user was created successfully, false otherwise.
   */
  public async register(
    userCreateDto: UserCreateDto,
  ): Promise<UserCreateResponseDto> {
    const user = await this.userService.create(userCreateDto);

    if (!user) {
      throw new Error('Unable to create user');
    }

    //send account verification email to user's email
    const isEmailSent = await this.sendAccountVerificationEmail(user);

    if (!isEmailSent) {
      throw new Error('Unable to send account verification email');
    } else {
      return { status: true, message: 'User created successfully' };
    }
  }

  /**
   * @description Sends account verification email to new registered user
   * @param userDto - The user registration details.
   * @returns True if the email was sent successfully, false otherwise.
   */
  private async sendAccountVerificationEmail(
    userCreatedDto: UserCreatedDto,
  ): Promise<boolean> {
    // Implement email sending logic here
    // You can use a library like Nodemailer or a third-party email service
    // to send the verification email to the user's email address.
    // Return true if the email was sent successfully, false otherwise.

    const token = userCreatedDto.verificationToken;
    // Send the verification email to the user's email address
    return true;
  }

  /**
   * Generates a JWT access token.
   * @param userId - The user's ID.
   * @returns The JWT access token.
   */
  private async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<string> {
    try {
      const payload: IJwtPayload = {
        sub: userId, // The user's unique identifier (e.g., ID)
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      };

      return this.jwtService.signAsync(payload, {
        secret: getEnvVar('JWT_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Unable to generate access token');
    }
  }
}
