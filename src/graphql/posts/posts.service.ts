/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { CreatePostInput } from 'src/graphql/posts/posts.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostInput, select: any) {
    return await this.prisma.post.create({
      data,
      ...select,
    });
  }

  async findOne(id: string, select: any) {
    return await this.prisma.post.findUnique({
      where: { id },
      ...select,
    });
  }

  async findAll(select: any) {
    return await this.prisma.post.findMany({
      ...select,
    });
  }
}
