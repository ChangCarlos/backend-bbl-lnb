import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
    minLength: 2,
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name is too short' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password is too short' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @ApiProperty({
    example: 'USER',
    enum: UserRole,
    description: 'Role do usuário (opcional, padrão: USER)',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be USER or ADMIN' })
  role?: UserRole;
}
