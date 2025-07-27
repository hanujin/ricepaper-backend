import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
