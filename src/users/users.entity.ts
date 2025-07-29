import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany } from 'typeorm';
import { Message } from '../messages/messages.entity';
import { Comment } from '../comments/comments.entity';
import { Post } from '../posts/posts.entity';

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

  @OneToMany(() => Comment, (comment) => comment.commenter)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}