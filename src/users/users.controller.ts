// src/users/users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagesService } from 'src/messages/messages.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  )
   {}

  // 전체 유저 목록 조회 (ex: 롤링페이퍼 쓸 때 유저 리스트)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();

    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const hasAllMessages = await this.messagesService.checkAllWrittenTo(user.id);
        return { ...user, allWritten: hasAllMessages };
      })
    );

    return usersWithStatus;
  }

  // 특정 유저 정보 조회 (ex: 유저 프로필)
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Get()
  async getUsersWithStatus() {
    const users = await this.usersService.findAll();
    const userStatuses = await Promise.all(
      users.map(async (user) => {
        const allWritten = await this.messagesService.hasReceivedAllMessages(user.id);
        return {
          ...user,
          allWritten,
        };
      }),
    );
    return userStatuses;
  }
}