import { Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from './r2.service';

@Controller('upload')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.r2Service.uploadFile(file);
    return { url };
  }
}