/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // ------------------------- PrismaSelect ------------------------- //

  // Универсальный хелпер для внедрения select (на основе GraphQLResolveInfo)
  private applySelect(info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return select?.select ? select : {}; // PrismaSelect может вернуть { select: {...} } или {}
  }

  // Универсальная обёртка для findUnique()
  async findUniqueWithInfo<T, A>(
    model: { findUnique(args: A): Promise<T> },
    args: A,
    info: GraphQLResolveInfo,
  ): Promise<T> {
    const select = this.applySelect(info);
    return model.findUnique({ ...args, ...select });
  }

  // Универсальная обёртка для findMany()
  async findManyWithInfo<T, A>(
    model: { findMany(args: A): Promise<T> },
    args: A,
    info: GraphQLResolveInfo,
  ): Promise<T> {
    const select = this.applySelect(info);
    return model.findMany({ ...args, ...select });
  }

  // Универсальная обёртка для findFirst()
  async findFirstWithInfo<T, A>(
    model: { findFirst(args: A): Promise<T> },
    args: A,
    info: GraphQLResolveInfo,
  ): Promise<T> {
    const select = this.applySelect(info);
    return model.findFirst({ ...args, ...select });
  }
}

// findManyWithInfo, findUniqueWithInfo, findFirstWithInfo- это универсальные методы, которые:
//    Получают info: GraphQLResolveInfo.
//    Строят Prisma select через @paljs/plugins → PrismaSelect.
//    Подмешивают select в параметры.
//    Вызывают оригинальный prisma клиент.
