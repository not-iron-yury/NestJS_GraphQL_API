import { Injectable, Scope } from '@nestjs/common';
import { Comment } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST }) // 	Новый экземпляр провайдера создаётся исключительно для каждого входящего запроса. Экземпляр удаляется сборщиком мусора после завершения обработки запроса.
export class CommentsLoader {
  constructor(private readonly prisma: PrismaService) {}

  // пакетная загрузка по id
  readonly byId = new DataLoader<string, Comment | null>(async (ids) => {
    const comments = await this.prisma.comment.findMany({
      where: { id: { in: [...ids] } },
    });

    const map = new Map(comments.map((comment) => [comment.id, comment]));

    return ids.map((id) => map.get(id) ?? null);
  });
}
