import { Injectable } from '@nestjs/common';
import { CreatePostInput } from 'src/graphql/posts/posts.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostInput) {
    return await this.prisma.post.create({ data });
  }

  async findOne(id: string) {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async getAuthor(authorId: string) {
    return await this.prisma.user.findUnique({
      where: { id: authorId },
    });
  }

  async getAllComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
    });
  }
}
