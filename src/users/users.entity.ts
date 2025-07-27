import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany } from 'typeorm';
import { Message } from '../messages/messages.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}