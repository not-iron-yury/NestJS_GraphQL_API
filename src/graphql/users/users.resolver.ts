/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { buildPrismaSelect } from 'src/common/prisma-select';
import { CreateUserInput } from 'src/graphql/users/users.input';
import { UsersService } from './users.service';
import { User } from './users.type';

@Resolver(() => User) // этот резолвер обслуживает тип User
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // создать пользователя
  @Mutation(() => User)
  async createUser(
    @Args('data') data: CreateUserInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = buildPrismaSelect(info);
    return await this.usersService.create(data, select);
  }

  // найти пользователя по id
  @Query(() => User)
  async getUser(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    const select = buildPrismaSelect(info);
    return await this.usersService.findOne(id, select);
  }

  // все пользователи
  @Query(() => [User], { name: 'users' }) // если имя указано вручную — оно заменяет имя метода.
  async getUsers(@Info() info: GraphQLResolveInfo) {
    const select = buildPrismaSelect(info);
    return await this.usersService.findAll(select);
  }
}

//---------------------- Запросы для тестов ----------------------
// http://localhost:3000/graphql

// >> Создать автора. Получить обратно данные автора.
// mutation {
//   createUser(data: { email: "test@mail.com", name: "Yuri" }) {
//     id
//     email
//     name
//   }
// }

// >> Получить пользователя по id (c постами и комментариями)
// query {
//   getUser(id: "cmj1f0jz10000ukmgmy414jy4") {
//     id
//     email
//     name
//     createdAt
//    posts {
//       id
//       title
//     }
//     comments {
//       id
//       text
//     }
//   }
// }

// >> Получить всех пользователей (с их постами и комментариями)
// query {
//   users {
//     id
//     name
//     email
//     posts {
//       id
//       title
//     }
//     comments {
//       id
//       text
//     }
//   }
// }
