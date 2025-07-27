import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { Post } from '../posts/posts.entity';
import { User } from '../users/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(postId: number, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    const commenter = await this.userRepo.findOne({ where: { id: dto.commenterId } });
    if (!post || !commenter) throw new NotFoundException('Post or user not found');

    const comment = this.commentRepo.create({ content: dto.content, post, commenter });
    return this.commentRepo.save(comment);
  }

  async findByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['commenter'],
      order: { created_at: 'ASC' },
    });
  }

  async delete(commentId: number) {
    return this.commentRepo.delete(commentId);
  }
}