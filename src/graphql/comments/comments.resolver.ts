/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { buildPrismaSelect } from 'src/common/prisma-select';
import { CreateCommentInput } from 'src/graphql/comments/comments.input';
import { CommentsService } from './comments.service';
import { Comment } from './comments.type';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  // создать комментарий
  @Mutation(() => Comment)
  async createComment(
    @Args('data') data: CreateCommentInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = buildPrismaSelect(info);
    return await this.commentsService.create(data, select);
  }

  // найти комментарий по id
  @Query(() => Comment, { name: 'comment', nullable: true })
  async getComment(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    const select = buildPrismaSelect(info);
    return await this.commentsService.findOne(id, select);
  }

  // все комментарии
  @Query(() => [Comment], { name: 'comments' })
  async getComments(@Info() info: GraphQLResolveInfo) {
    const select = buildPrismaSelect(info);
    return await this.commentsService.findAll(select);
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
