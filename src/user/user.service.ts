import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDto } from './dto/user-create.dto';
import { USER_ALREADY_EXIST } from './user.constants';
import { hash, genSalt } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async createUser(dto: UserCreateDto): Promise<UserDocument> {
		const oldUser = await this.findUser(dto.email);

		if (oldUser) {
			throw new BadRequestException(USER_ALREADY_EXIST);
		}

		const salt = await genSalt(10);
		const newUser = dto;
		newUser.password = await hash(newUser.password, salt);
		return this.userModel.create(newUser);
	}

	async findUser(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async deleteUser(email: string): Promise<UserDocument | null> {
		return this.userModel.findOneAndDelete({ email }).exec();
	}
}
