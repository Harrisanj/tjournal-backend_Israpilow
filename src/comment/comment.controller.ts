import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from '../decorators/user.decorators';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() userId: number) {
    console.log(userId);
    return this.commentService.create(createCommentDto, userId);
  }

  @Get()
  findAll(@Query() query: { postId: string }) {
    return this.commentService.findAll(+query.postId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
