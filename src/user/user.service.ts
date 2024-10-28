import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDto } from './dto/user-create.dto';
import { HASH_ERR, USER_ALREADY_EXIST, USER_CREATE_ERR } from './user.constants';
import { hash, genSalt } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async createUser(dto: UserCreateDto): Promise<UserDocument> {
		let salt = '';
		let passHash = '';

		const oldUser = await this.findUser(dto.email);

		if (oldUser) {
			throw new BadRequestException(USER_ALREADY_EXIST);
		}

		try {
			salt = await genSalt(10);
			passHash = await hash(dto.password, salt);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			throw new BadRequestException(HASH_ERR);
		}

		const newUser: User = {
			email: dto.email,
			name: dto.name,
			phone: dto.phone,
			role: dto.role,
			password: passHash,
		};
		try {
			return await this.userModel.create(newUser);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			throw new BadRequestException(USER_CREATE_ERR);
		}
	}

	async findUser(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async deleteUser(email: string): Promise<UserDocument | null> {
		return this.userModel.findOneAndDelete({ email }).exec();
	}
}
