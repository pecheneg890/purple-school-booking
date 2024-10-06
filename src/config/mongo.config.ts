import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
	return {
		uri: getMongoString(configService),
	};
};

export const getMongoString = (configService: ConfigService) => {
	let login = configService.get('MONGO_LOGIN') || '';
	if (login) {
		login = login + ':' + configService.get('MONGO_PASS') + '@';
	}

	return (
		'mongodb://' +
		login +
		configService.get('MONGO_HOST') +
		':' +
		configService.get('MONGO_PORT') +
		'/' +
		configService.get('MONGO_DB')
	);
};
