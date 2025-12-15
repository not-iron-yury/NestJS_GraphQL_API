import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import {
  CreateUserInput,
  UpdateUserInput,
} from 'src/graphql/users/users.input';
import { UsersLoader } from 'src/graphql/users/users.loader';
import { UsersService } from './users.service';
import { User } from './users.type';

@Resolver(() => User) // этот резолвер обслуживает тип User
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersLoader: UsersLoader,
  ) {}

  // ----------------- Dataloader -----------------

  // создать пользователя
  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.usersService.create(data);
  }

  // изменить
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ) {
    await this.usersService.update(id, data); // выполняется SQL UPDATE, GraphQL про это вообще не знает и никакого кеша тут нет
    return this.usersLoader.byId.load(id); // вытягиваем из БД данные пользователя (для возврата) через Loader и кешируем
  }

  // удалить
  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    const user = await this.usersLoader.byId.load(id); // предварительно вытягиваем и кешируем данные из БД
    await this.usersService.delete(id); // удаляем запись в БД
    return user;
  }

  // ----------------- Smart Select -----------------

  // найти пользователя по id
  @Query(() => User)
  async getUser(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    return await this.usersService.findOne(id, info);
  }

  // все пользователи
  @Query(() => [User], { name: 'users' }) // если имя указано вручную — оно заменяет имя метода.
  async getUsers(@Info() info: GraphQLResolveInfo) {
    return await this.usersService.findAll(info);
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
