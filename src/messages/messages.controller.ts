// src/messages/messages.controller.ts
import { Controller, Post, Get, Patch,Delete, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(dto);
  }

  @Get('received/:recipientId')
  getReceivedMessages(@Param('recipientId') recipientId: number) {
    return this.messagesService.getReceivedMessages(recipientId);
  }

  // 작성한 메시지 목록
  @Get('written/:writerId')
  getWrittenMessages(@Param('writerId') writerId: number) {
    return this.messagesService.getWrittenMessages(writerId);
  }

  // 특정 메시지 상세
  @Get(':writerId/:recipientId')
  getSpecificMessage(
    @Param('writerId') writerId: number,
    @Param('recipientId') recipientId: number,
  ) {
    return this.messagesService.getMessageByUsers(writerId, recipientId);
  }

  @Patch(':writerId/:recipientId')
  updateMessage(
    @Param('writerId') writerId: number,
    @Param('recipientId') recipientId: number,
    @Body('content') content: string,
  ) {
    return this.messagesService.updateMessage(writerId, recipientId, content);
  }

  @Delete(':writerId/:recipientId')
  deleteMessage(
    @Param('writerId') writerId: number,
    @Param('recipientId') recipientId: number,
  ) {
    return this.messagesService.deleteMessage(writerId, recipientId);
  }
}