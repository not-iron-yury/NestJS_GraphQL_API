import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
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
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    return await this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserInput) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.user.delete({ where: { id } });
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
