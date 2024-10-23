import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import { FileElementResponse } from './dto/file-element.dto';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
	async saveFiles(files: Express.Multer.File[]): Promise<FileElementResponse[]> {
		let buffer;
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);

		const res: FileElementResponse[] = [];

		for (const file of files) {
			if (file.mimetype.includes('image')) {
				buffer = await this.convertImage(file.buffer);
			} else {
				buffer = file.buffer;
			}

			await writeFile(`${uploadFolder}/${file.originalname}`, buffer);
			res.push({ url: `/static/${dateFolder}/${file.originalname}`, name: file.originalname });
		}

		return res;
	}

	/** Конвертация изображения до 500 пикселей по ширине */
	async convertImage(file: Buffer): Promise<Buffer> {
		return await sharp(file).resize(500).toBuffer();
	}
}
