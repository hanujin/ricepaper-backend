import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { extname } from 'path';

@Injectable()
export class R2Service {
  private s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT, 
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    }
  });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // ⚠️ R2는 이거 무시할 수 있음, 퍼블릭 설정 필요
    }));

    const publicBaseUrl = process.env.R2_PUBLIC_URL;
    return `${publicBaseUrl}/${filename}`;
  }
}