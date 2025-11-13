import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserResponse, TokenPair } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const { email, password, name } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  generateTokens(user: UserResponse): TokenPair {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn =
      this.configService.get<string>('jwt.jwtExpiresIn') || '15m';
    const refreshSecret = this.configService.get<string>(
      'jwt.jwtRefreshSecret',
    );
    const refreshExpiresIn =
      this.configService.get<string>('jwt.jwtRefreshExpiresIn') || '7d';

    if (!secret || !refreshSecret) {
      throw new Error('JWT secrets not configured');
    }

    const accessOptions = {
      secret,
      expiresIn,
    } as JwtSignOptions;

    const refreshOptions = {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    } as JwtSignOptions;

    const accessToken = this.jwtService.sign(payload, accessOptions);
    const refreshToken = this.jwtService.sign(payload, refreshOptions);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };

    const secret = this.configService.get<string>('jwt.jwtSecret');
    const expiresIn =
      this.configService.get<string>('jwt.jwtExpiresIn') || '15m';

    if (!secret) {
      throw new Error('JWT secret not configured');
    }

    const options = {
      secret,
      expiresIn,
    } as JwtSignOptions;

    return this.jwtService.sign(payload, options);
  }
}
