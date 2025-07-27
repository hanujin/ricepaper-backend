import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/users.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const sender = await this.userRepo.findOneBy({ id: dto.senderId });
    const receiver = await this.userRepo.findOneBy({ id: dto.receiverId });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.messageRepo.create({
      content: dto.content,
      sender,
      receiver,
    });

    return this.messageRepo.save(message);
  }
}