import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { R2Controller } from './r2.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [R2Service],
  controllers: [R2Controller],
})
export class R2Module {}