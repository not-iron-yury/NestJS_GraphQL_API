/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput } from './comments.input';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentInput, select: any) {
    return await this.prisma.comment.create({
      data,
      ...select,
    });
  }

  async findOne(id: string, select: any) {
    return await this.prisma.comment.findUnique({
      where: { id },
      ...select,
    });
  }

  async findAll(select: any) {
    return await this.prisma.comment.findMany({
      ...select,
    });
  }
}
