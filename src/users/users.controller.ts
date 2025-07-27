// src/users/users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 전체 유저 목록 조회 (ex: 롤링페이퍼 쓸 때 유저 리스트)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  // 특정 유저 정보 조회 (ex: 유저 프로필)
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
}