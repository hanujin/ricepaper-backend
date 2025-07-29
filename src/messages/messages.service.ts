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

    async getReceivedMessages(recipientId: number) {
    return this.messageRepo.find({
        where: { receiver: { id: recipientId } },
        relations: ['sender', 'receiver'],
    });
    }

    async getWrittenMessages(writerId: number) {
    return this.messageRepo.find({
        where: { sender: { id: writerId } },
        relations: ['sender', 'receiver'],
    });
    }

    async getMessageByUsers(writerId: number, recipientId: number) {
    return this.messageRepo.findOne({
        where: {
        sender: { id: writerId },
        receiver: { id: recipientId },
        },
        relations: ['sender', 'receiver'],
    });
    }

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

    async getMessageStatus() {
      const users = await this.userRepo.find();
      const messages = await this.messageRepo.find({ relations: ['sender'] });

      const senderIds = new Set(messages.map((msg) => msg.sender.id));
      const totalUsers = users.length;
      const writtenUsers = senderIds.size;

      return {
        totalUsers,
        writtenUsers,
        allWritten: totalUsers === writtenUsers,
      };
    }

    async hasReceivedAllMessages(receiverId: number): Promise<boolean> {
      const totalUsers = await this.userRepo.count();
      const senders = await this.messageRepo
        .createQueryBuilder('message')
        .select('message.senderId')
        .where('message.receiverId = :receiverId', { receiverId })
        .distinct(true)
        .getRawMany();

      const senderCount = senders.length;

      return senderCount === totalUsers - 1;
    }

    async getUsersWithAllWrittenStatus() {
      // 1. 모든 유저와 모든 메시지를 한 번에 가져옵니다.
      const allUsers = await this.userRepo.find();
      const allMessages = await this.messageRepo.find({
        relations: ['sender', 'receiver'],
      });
  
      // 2. 각 유저가 받은 메시지들을 효율적으로 찾기 위해 Map을 생성합니다.
      const messagesByReceiver = new Map<number, Set<number>>();
      for (const message of allMessages) {
        // sender와 receiver가 존재하는지 확인하여 안정성 확보
        if (message.receiver && message.sender) {
          const receiverId = message.receiver.id;
          if (!messagesByReceiver.has(receiverId)) {
            messagesByReceiver.set(receiverId, new Set());
          }
          // non-null assertion (!)을 사용하여 TypeScript 에러 해결
          messagesByReceiver.get(receiverId)!.add(message.sender.id);
        }
      }
  
      // 3. 각 유저에 대해 'allWritten' 상태를 계산합니다.
      const usersWithStatus = allUsers.map((user) => {
        // 이 유저를 제외한 모든 유저의 ID 목록
        const requiredSenders = allUsers
          .map((u) => u.id)
          .filter((id) => id !== user.id);
        
        // 이 유저가 받은 메시지의 발신자 목록
        const actualSenders = messagesByReceiver.get(user.id) || new Set();
  
        // 모든 필수 발신자가 메시지를 보냈는지 확인
        const allWritten = requiredSenders.every((senderId) =>
          actualSenders.has(senderId),
        );
  
        return {
          ...user,
          allWritten,
        };
      });
  
      return usersWithStatus;
    }
}
