import { Injectable, Scope } from '@nestjs/common';
import { Post } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST }) // 	Новый экземпляр провайдера создаётся исключительно для каждого входящего запроса. Экземпляр удаляется сборщиком мусора после завершения обработки запроса.
export class PostsLoader {
  constructor(private readonly prisma: PrismaService) {}

  // batch-load по id
  readonly byId = new DataLoader<string, Post | null>(async (ids) => {
    const posts = await this.prisma.post.findMany({
      where: { id: { in: [...ids] } },
    });

    const map = new Map(posts.map((post) => [post.id, post]));

    return ids.map((id) => map.get(id) ?? null);
  });
}
