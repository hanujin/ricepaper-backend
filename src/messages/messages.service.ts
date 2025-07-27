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

    // 받은 메시지 목록
    async getReceivedMessages(recipientId: number) {
    return this.messageRepo.find({
        where: { receiver: { id: recipientId } },
        relations: ['sender', 'receiver'],
    });
    }

    // 작성한 메시지 목록
    async getWrittenMessages(writerId: number) {
    return this.messageRepo.find({
        where: { sender: { id: writerId } },
        relations: ['sender', 'receiver'],
    });
    }

    // 특정 메시지 상세
    async getMessageByUsers(writerId: number, recipientId: number) {
    return this.messageRepo.findOne({
        where: {
        sender: { id: writerId },
        receiver: { id: recipientId },
        },
        relations: ['sender', 'receiver'],
    });
    }

    // 수정 기능
    async updateMessage(writerId: number, recipientId: number, content: string): Promise<Message> {
        const message = await this.messageRepo.findOne({
            where: {
            sender: { id: writerId },
            receiver: { id: recipientId },
            },
            relations: ['sender', 'receiver'],
        });

        if (!message) {
            throw new Error('Message not found');
        }

        message.content = content;
        return this.messageRepo.save(message);
    }

    async deleteMessage(writerId: number, recipientId: number): Promise<{ message: string }> {
        const message = await this.messageRepo.findOne({
            where: {
            sender: { id: writerId },
            receiver: { id: recipientId },
            },
        });

        if (!message) {
            throw new Error('Message not found');
        }

        await this.messageRepo.remove(message);

        return { message: 'Message deleted successfully' };
    }
}