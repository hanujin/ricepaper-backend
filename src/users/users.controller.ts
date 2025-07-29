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
    // 최적화된 서비스 메소드를 호출하여 N+1 문제를 해결합니다.
    return this.messagesService.getUsersWithAllWrittenStatus();
  }

  // 특정 유저 정보 조회 (ex: 유저 프로필)
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
}
