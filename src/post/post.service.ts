import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async popular() {
    const qb = this.repository.createQueryBuilder();

    qb.orderBy('views', 'DESC');

    const [items, count] = await qb.getManyAndCount();

    return {
      items,
      count,
    };
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.title) qb.where(`p.title ILIKE :title`);

    if (dto.body) qb.where(`p.body ILIKE :body`);

    if (dto.views) qb.orderBy('views', dto.views);

    if (dto.tag) qb.where(`p.tag ILIKE :tag`);

    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      views: dto.views || '',
      tag: `%${dto.tag}%`,
    });

    console.log(qb.getSql());
    const [items, count] = await qb.getManyAndCount();

    return { items, count };
  }

  async findOne(id: number) {
    await this.repository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({
        views: () => 'views + 1',
      })
      .execute();

    // if (!find) {
    //   throw new NotFoundException('Статья не найдена');
    // }
    return await this.repository.findOneById(+id);
  }

  async update(id: number, dto: UpdatePostDto) {
    const find = await this.repository.findOneById(+id);

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const find = await this.repository.findOneById(+id);

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    return this.repository.delete(id);
  }
}
