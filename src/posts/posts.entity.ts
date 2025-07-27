import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Comment } from '../comments/comments.entity';

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
}