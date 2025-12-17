/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
import {
  badInput,
  conflict,
  internalError,
  notFound,
} from 'src/graphql/errors/graphql-errors';
import {
  CreateUserInput,
  UpdateUserInput,
} from 'src/graphql/users/users.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- Dataloader -----------------
  async create(data: CreateUserInput) {
    // бизнес-валидация, запрос корректный и class-validator проходит, но логика приложения запрещает действие
    if (data.name?.toLowerCase().includes('admin')) {
      throw badInput('Некорректное имя пользователя');
    }

    try {
      return await this.prisma.user.create({ data });
    } catch (e: any) {
      // ловим ошибки только на границе (Prisma / внешние системы) и бросаем свои GraphQLError
      if (e.code === 'P2002') {
        throw conflict('Пользователь с таким email уже существует');
      } else {
        throw internalError();
      }
    }
  }

  async update(id: string, data: UpdateUserInput) {
    if (data.name?.toLowerCase().includes('admin')) {
      throw badInput('Некорректное имя пользователя');
    }

    try {
      return this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw notFound('Пользователь не найден');
      } else {
        throw internalError();
      }
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw notFound('Пользователь не найден');
      } else {
        throw internalError();
      }
    }
  }

  // ----------------- Smart Select -----------------
  async findOne(id: string, info: GraphQLResolveInfo) {
    return await this.prisma.findUniqueWithInfo(
      this.prisma.user, // Prisma модель, к которой делаем запрос
      { where: { id } }, // аргументы Prisma (условия поиска)
      info, // GraphQLResolveInfo — AST запроса, используется для построения select/include
    );
  }

  async findAll(info: GraphQLResolveInfo) {
    return await this.prisma.findManyWithInfo(this.prisma.user, {}, info);
  }
}
