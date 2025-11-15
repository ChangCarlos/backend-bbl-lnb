import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
