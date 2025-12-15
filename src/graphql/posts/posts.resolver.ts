import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import {
  CreatePostInput,
  UpdatePostInput,
} from 'src/graphql/posts/posts.input';
import { PostsLoader } from 'src/graphql/posts/posts.loader';
import { PostsService } from './posts.service';
import { Post } from './posts.type';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsLoader,
  ) {}

  // ----------------- Dataloader -----------------

  // изменить
  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: string,
    @Args('data') data: UpdatePostInput,
  ) {
    await this.postsService.update(id, data); // выполняется SQL UPDATE, GraphQL про это вообще не знает и никакого кеша тут нет
    return this.postsLoader.byId.load(id); // вытягиваем из БД данные поста (для возврата) через Loader и кешируем
  }

  // удалить
  @Mutation(() => Post)
  async deletePost(@Args('id') id: string) {
    const post = await this.postsLoader.byId.load(id); // предварительно вытягиваем и кешируем данные из БД
    await this.postsService.delete(id); // удаляем запись в БД
    return post;
  }

  // ----------------- Smart Select -----------------

  // создать пост
  @Mutation(() => Post)
  async createPost(
    @Args('data') data: CreatePostInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.postsService.create(data, info);
  }

  // найти пост по id
  @Query(() => Post, { name: 'post', nullable: true })
  async getPost(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    return await this.postsService.findOne(id, info);
  }

  // все посты
  @Query(() => [Post], { name: 'posts' })
  async getPosts(@Info() info: GraphQLResolveInfo) {
    return await this.postsService.findAll(info);
  }
}

//---------------------- Запросы для тестов ----------------------
// http://localhost:3000/graphql

// >> Создать пост. Получить обратно пост и данные автора.
// mutation {
//   createPost(data: { title: "Первый пост", content: "Текст поста", authorId: "cmj1f0jz10000ukmgmy414jy4" }) {
//     id
//     title
//     content
//     author {   // тянем из БД дополнительно эти данные через include: { author: true }
//       id
//       name
//     }
//   }
// }

// >> Получить все посты с их авторами, + комментарии и авторами комментариев
// query {
//   posts {
//     id
//     title
//     content
//     author {
//       id
//       name
//     }
//     comments {
//       id
//       text
//       author {
//         id
//         name
//       }
//     }
//   }
// }
