/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'src/graphql/users/users.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput, select: any) {
    return await this.prisma.user.create({
      data,
      ...select,
    });
  }

  async findOne(id: string, select: any) {
    return await this.prisma.user.findUnique({
      where: { id },
      ...select,
    });
  }

  async findAll(select: any) {
    return await this.prisma.user.findMany({
      ...select,
    });
  }
}
