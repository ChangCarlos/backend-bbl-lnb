import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único do usuário',
  })
  id: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'USER',
    enum: ['USER', 'ADMIN'],
    description: 'Role do usuário',
  })
  role: string;

  @ApiProperty({
    example: '2025-01-15T10:30:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-15T10:30:00.000Z',
    description: 'Data de atualização',
  })
  updatedAt: Date;
}

export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'Token atualizado com sucesso' })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logout realizado com sucesso' })
  message: string;
}

export class MeResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
