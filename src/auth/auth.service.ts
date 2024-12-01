import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: UserCreateDto) {
		return this.userService.createUser(dto);
	}

	async login(dto: LoginDto) {
		const user = await this.userService.findUser(dto.email);
		if (!user) throw new UnauthorizedException(USER_NOT_FOUND);

		const isCorrectPassword = await compare(dto.password, user.password);
		if (!isCorrectPassword) throw new UnauthorizedException(WRONG_PASSWORD);

		const payload = { email: user.email, role: user.role };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
