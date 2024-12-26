import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenDTO, LoginDTO, RegistrationDTO } from './auth.dtos';
import { UserService } from '../user/user.service';
import { UserCreatingDTO } from '../user/user.dtos';
import { UserWithUserPassword } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async register(userRegistratingDTO: RegistrationDTO): Promise<TokenDTO> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        userRegistratingDTO.password,
        salt,
      );

      const userDTO: UserCreatingDTO = {
        username: userRegistratingDTO.username,
        email: userRegistratingDTO.email,
        pass_hash: hashedPassword,
      };

      const createdUser = await this.userService.createOne(userDTO);

      const jwtPayload = {
        userId: createdUser.id,
      };

      return {
        access_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        }),
        refresh_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async login(jwtPayload: any): Promise<TokenDTO> {
    try {
      return {
        access_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        }),
        refresh_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async validateUser(userLoginDTO: LoginDTO): Promise<UserWithUserPassword> {
    try {
      const user = await this.userService.findOneByEmail(userLoginDTO.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatched = await bcrypt.compare(
        userLoginDTO.password,
        user.password_hash,
      );

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  validateToken(token: string, tokenType: 'refresh' | 'access') {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch {
      throw new UnauthorizedException(`Invalid ${tokenType} token`);
    }
  }
}
