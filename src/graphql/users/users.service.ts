import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'src/graphql/users/users.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput) {
    return await this.prisma.user.create({ data });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findAllPosts(id: string) {
    return this.prisma.post.findMany({ where: { authorId: id } });
  }

  async findAllComments(id: string) {
    return this.prisma.comment.findMany({ where: { authorId: id } });
  }
}
