import { Injectable, Scope } from '@nestjs/common';
import { User } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST }) // 	Новый экземпляр провайдера создаётся исключительно для каждого входящего запроса. Экземпляр удаляется сборщиком мусора после завершения обработки запроса.
export class UsersLoader {
  constructor(private readonly prisma: PrismaService) {}

  // пакетная загрузка по id
  readonly byId = new DataLoader<string, User | null>(async (ids) => {
    const users = await this.prisma.user.findMany({
      where: { id: { in: [...ids] } },
    });

    const map = new Map(users.map((user) => [user.id, user]));

    return ids.map((id) => map.get(id) ?? null);
  });
}
