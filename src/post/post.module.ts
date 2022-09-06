import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
