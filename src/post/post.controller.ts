import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { SearchPostDto } from "./dto/search-post.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/decorators/user.decorators";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() userId: number,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postService.update(+id, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/popular')
  findSortViews() {
    return this.postService.popular();
  }

  @Get('/search')
  searchPosts(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findById(+id);
  }

// Функционал для загрузки изображения
/*  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

        cb(null, newFileName);
      }
    }),
    /!*fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg,jpeg,png,gif)$/)) {
        cb(null, false)
      }
      cb(null, true);
    }*!/
  }))*/
/*  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      return {
        filePath: `http://localhost:6200/posts/pictures/${file.filename}`
      }
    }
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, {root: './uploads'})
  }*/
}
