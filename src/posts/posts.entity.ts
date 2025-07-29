import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn,} from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { User } from '../users/users.entity'; // 유저 엔티티 import 해줘야 함

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}