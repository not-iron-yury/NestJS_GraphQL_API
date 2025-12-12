import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateCommentInput } from 'src/graphql/comments/comments.input';
import { Post } from 'src/graphql/posts/posts.type';
import { User } from 'src/graphql/users/users.type';
import { CommentsService } from './comments.service';
import { Comment } from './comments.type';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  // создать комментарий
  @Mutation(() => Comment)
  async createComment(@Args('data') data: CreateCommentInput) {
    return await this.commentsService.create(data);
  }

  // найти комментарий по id
  @Query(() => Comment, { name: 'comment', nullable: true })
  async getComment(@Args('id') id: string) {
    return await this.commentsService.findOne(id);
  }

  // все комментарии
  @Query(() => [Comment], { name: 'comments' })
  async getComments() {
    return await this.commentsService.findAll();
  }

  // -------------- ResolveField:

  // получить автора коммента
  @ResolveField(() => User)
  async author(@Parent() comment: Comment) {
    return await this.commentsService.getAuthor(comment.authorId);
  }

  // получить пост к которому был сделан коммент
  @ResolveField(() => Post)
  async post(@Parent() comment: Comment) {
    return this.commentsService.getPost(comment.postId);
  }
}

//---------------------- Запросы для тестов ----------------------
// http://localhost:3000/graphql

// >> Создать комментарий. Получить обратно комментарий, пост и автора.
// mutation {
//   createComment(data: { text: "Отлично", postId: "cmj1kdilf0003ukzkwuom4r8t", authorId: "cmj1f0jz10000ukmgmy414jy4" }) {
//     id
//     text
//     post {
//       id
//       title
//     }
//     author {
//       id
//       name
//     }
//   }
// }

// >> Получить все комментарии (с их авторами и постами)
// query {
//   comments {
//     id
//     text
//     post {
//       id
//       title
//     }
//     author {
//       id
//       name
//     }
//   }
// }
