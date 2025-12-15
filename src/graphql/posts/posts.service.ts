import { Injectable, NotFoundException } from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
import {
  CreatePostInput,
  UpdatePostInput,
} from 'src/graphql/posts/posts.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- Dataloader -----------------
  async update(id: string, data: UpdatePostInput) {
    const exists = await this.prisma.post.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Пост не найден');
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const exists = await this.prisma.post.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Пост не найден');
    }

    return await this.prisma.post.delete({ where: { id } });
  }

  // ----------------- Smart Select -----------------
  async create(data: CreatePostInput, info: GraphQLResolveInfo) {
    const newPost = await this.prisma.post.create({ data });

    return await this.prisma.findUniqueWithInfo(
      this.prisma.post,
      { where: { id: newPost.id } },
      info,
    );
  }

  async findOne(id: string, info: GraphQLResolveInfo) {
    return await this.prisma.findUniqueWithInfo(
      this.prisma.post, // Prisma модель, к которой делаем запрос
      { where: { id } }, // аргументы Prisma (условия поиска)
      info, // GraphQLResolveInfo — AST запроса, используется для построения select/include
    );
  }

  async findAll(info: GraphQLResolveInfo) {
    return await this.prisma.findManyWithInfo(this.prisma.post, {}, info);
  }
}
