import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { CreatePostInput } from 'src/graphql/posts/posts.input';
import { PostsService } from './posts.service';
import { Post } from './posts.type';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

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
