import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  RegisterResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
  MeResponseDto,
} from './dto/auth-response.dto';
import {
  ErrorResponseDto,
  UnauthorizedResponseDto,
} from '../../common/dto/error-response.dto';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type {
  UserResponse,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
  MeResponse,
} from './interfaces/auth-response.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({
    type: RegisterDto,
    description: 'Dados para registro de novo usuário',
    examples: {
      user: {
        summary: 'Usuário comum',
        value: {
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'senha123',
        },
      },
      admin: {
        summary: 'Administrador',
        value: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já cadastrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
    type: ErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    const user = await this.authService.register(registerDto);
    return { user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login',
    examples: {
      example: {
        summary: 'Login de usuário',
        value: {
          email: 'joao@example.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Tokens enviados via cookies.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    type: UnauthorizedResponseDto,
  })
  async login(
    @CurrentUser() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const { accessToken, refreshToken } = this.authService.generateTokens(user);

  response.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
    domain: 'frontend-bbl-lnb.vercel.app',
    path: '/',
  });
  response.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: 'frontend-bbl-lnb.vercel.app',
    path: '/',
  });

    return { user };
  }


  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
    type: UnauthorizedResponseDto,
  })
  async refresh(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponse> {
    const accessToken = await this.authService.generateAccessToken(user.id);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      domain: 'https://frontend-bbl-lnb.vercel.app',
      path: '/',
    });

    return { message: 'Token atualizado com sucesso' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Fazer logout (limpa cookies)' })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
    type: UnauthorizedResponseDto,
  })
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponse> {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido',
    type: UnauthorizedResponseDto,
  })
  async getProfile(@CurrentUser() user: UserResponse): Promise<MeResponse> {
    return { user };
  }
}
