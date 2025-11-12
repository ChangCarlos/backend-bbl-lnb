import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name is too short' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password is too short' })
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
}
