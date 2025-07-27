// src/messages/messages.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(dto);
  }
}