import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Comment } from 'src/graphql/comments/comments.type';
import { CreatePostInput } from 'src/graphql/posts/posts.input';
import { User } from 'src/graphql/users/users.type';
import { PostsService } from './posts.service';
import { Post } from './posts.type';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  // создать пост
  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return await this.postsService.create(data);
  }

  // найти пост по id
  @Query(() => Post, { name: 'post', nullable: true })
  async getPost(@Args('id') id: string) {
    return await this.postsService.findOne(id);
  }

  // все посты
  @Query(() => [Post], { name: 'posts' })
  async getPosts() {
    return await this.postsService.findAll();
  }

  // -------------- ResolveField:

  // получить автора поста
  @ResolveField(() => User)
  async author(@Parent() post: Post) {
    return await this.postsService.getAuthor(post.authorId);
  }

  // получить все комментарии к посту
  @ResolveField(() => [Comment])
  async comments(@Parent() post: Post) {
    return await this.postsService.getAllComments(post.id);
  }
}

//---------------------- Запросы для тестов ----------------------
// http://localhost:3000/graphql

// >> Создать пост. Получить обратно пост и данные автора.
// mutation {
//   createPost(data: { title: "Первый пост", content: "Текст поста", authorId: "cmj1f0jz1" }) {
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
