import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create({
      content: dto.content,
      imageUrl: dto.imageUrl,
      user: { id: Number(dto.userId) },
    });

    return this.postRepo.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    post.content = dto.content;
    return this.postRepo.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }
}