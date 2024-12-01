import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { USER_NOT_FOUND } from './user.constants';
import { Role } from '../decorators/role.decorator';
import { Roles } from './schemas/user.schema';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	@Role(Roles.admin)
	async createUser(@Body() dto: UserCreateDto) {
		return await this.userService.createUser(dto);
	}

	@Get(':email')
	@Role(Roles.admin)
	async findUser(@Param('email') email: string) {
		const user = await this.userService.findUser(email);
		if (!user) throw new NotFoundException(USER_NOT_FOUND);
		return user;
	}

	@Delete(':email')
	@Role(Roles.admin)
	async deleteUser(@Param('email') email: string) {
		const deletedUser = await this.userService.deleteUser(email);
		if (!deletedUser) throw new NotFoundException(USER_NOT_FOUND);
	}
}
