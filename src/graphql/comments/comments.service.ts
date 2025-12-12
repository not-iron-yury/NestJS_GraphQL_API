import { Injectable } from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
import { CreateCommentInput } from 'src/graphql/comments/comments.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentInput, info: GraphQLResolveInfo) {
    const newComment = await this.prisma.comment.create({ data });

    return await this.prisma.findUniqueWithInfo(
      this.prisma.comment,
      { where: { id: newComment.id } },
      info,
    );
  }

  async findOne(id: string, info: GraphQLResolveInfo) {
    return await this.prisma.findUniqueWithInfo(
      this.prisma.comment, // Prisma модель, к которой делаем запрос
      { where: { id } }, // аргументы Prisma (условия поиска)
      info, // GraphQLResolveInfo — AST запроса, используется для построения select/include
    );
  }

  async findAll(info: GraphQLResolveInfo) {
    return await this.prisma.findManyWithInfo(this.prisma.comment, {}, info);
  }
}
