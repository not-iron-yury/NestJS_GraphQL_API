import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput } from './comments.input';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentInput) {
    return await this.prisma.comment.create({ data });
  }

  async findOne(id: string): Promise<object> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new BadRequestException('Комментарий не найден');
    return comment;
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }

  async getAuthor(authorId: string) {
    return this.prisma.user.findUnique({ where: { id: authorId } });
  }

  async getPost(postId: string) {
    return this.prisma.post.findUnique({ where: { id: postId } });
  }
}
