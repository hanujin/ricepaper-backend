import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/posts/:postId/comments')
  createComment(@Param('postId') postId: number, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(postId, dto);
  }

  @Get('/posts/:postId/comments')
  getComments(@Param('postId') postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @Delete('/comments/:id')
  deleteComment(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }
}