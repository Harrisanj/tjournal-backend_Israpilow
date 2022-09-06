import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  async findAll() {
    const arr = await this.repository
      .createQueryBuilder('u')
      .leftJoinAndMapMany(
        'u.comments',
        CommentEntity,
        'comment',
        'comment.userId = u.id'
      )
      .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
      .getMany();

    return arr.map((obj) => {
      delete obj.comments;
      return obj;
    });
  }
  async findById(id: number) {
    const arr = await this.repository
      .createQueryBuilder('u')
      .leftJoinAndMapMany(
        'u.comments',
        CommentEntity,
        'comment',
        'comment.userId = u.id'
      )
      .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
      .getMany();
      const result = arr.map((obj) => {
          delete obj.comments;
          return obj;
        }).filter((obj) => obj.id === id);
      return result[0]
      /*    return this.repository.findOne(id);*/
      }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne({ where: cond });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, {
      fullName: dto.fullName,
      password: dto.password,
    });
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.limit || 10);

    if (dto.fullName) qb.andWhere(`u.fullName ILIKE :fullName`);

    if (dto.email) qb.andWhere(`u.email ILIKE :email`);

    qb.setParameters({
      fullName: `%${dto.fullName}%`,
      email: `%${dto.email}%`,
    });

    const [items, count] = await qb.getManyAndCount();

    return { items, count };
  }
}
