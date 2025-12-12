import { Injectable } from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
import { CreateUserInput } from 'src/graphql/users/users.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput) {
    return await this.prisma.user.create({
      data,
    });
  }

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
