import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from '../schemas/user.schema';

export class UserCreateDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNumber()
	phone: number;

	@IsNotEmpty()
	@IsEnum(Roles)
	role: Roles;
}
