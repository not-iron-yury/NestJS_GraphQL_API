import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Comment } from 'src/graphql/comments/comments.type';
import { Post } from 'src/graphql/posts/posts.type';
import { CreateUserInput } from 'src/graphql/users/users.input';
import { UsersService } from './users.service';
import { User } from './users.type';

@Resolver(() => User) // этот резолвер обслуживает тип User
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // создать пользователя
  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return await this.usersService.create(data);
  }

  // найти пользователя по id
  @Query(() => User)
  async getUser(@Args('id') id: string) {
    return await this.usersService.findOne(id);
  }

  // все пользователи
  @Query(() => [User], { name: 'users' }) // если имя указано вручную — оно заменяет имя метода.
  async getUsers() {
    return await this.usersService.findAll();
  }

  // -------------- ResolveField:

  // все посты пользователя
  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    return this.usersService.findAllPosts(user.id);
  }

  // все комментарии пользователя
  @ResolveField(() => [Comment])
  async comments(@Parent() user: User) {
    return this.usersService.findAllComments(user.id);
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
