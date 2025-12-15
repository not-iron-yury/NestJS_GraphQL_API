import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import {
  CreateCommentInput,
  UpdateCommentInput,
} from 'src/graphql/comments/comments.input';
import { CommentsLoader } from 'src/graphql/comments/comments.loader';
import { CommentsService } from './comments.service';
import { Comment } from './comments.type';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsLoader: CommentsLoader,
  ) {}

  // ----------------- Dataloader -----------------

  // изменить
  @Mutation(() => Comment)
  async updateComment(
    @Args('id') id: string,
    @Args('data') data: UpdateCommentInput,
  ) {
    await this.commentsService.update(id, data); // выполняется SQL UPDATE, GraphQL про это вообще не знает и никакого кеша тут нет
    return this.commentsLoader.byId.load(id); // вытягиваем из БД данные комментария (для возврата) через Loader и кешируем
  }

  // удалить
  @Mutation(() => Comment)
  async deleteComment(@Args('id') id: string) {
    const comment = await this.commentsLoader.byId.load(id); // предварительно вытягиваем и кешируем данные из БД
    await this.commentsService.delete(id); // удаляем запись в БД
    return comment;
  }

  // ----------------- Smart Select -----------------

  // создать комментарий
  @Mutation(() => Comment)
  async createComment(
    @Args('data') data: CreateCommentInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.commentsService.create(data, info);
  }

  // найти комментарий по id
  @Query(() => Comment, { name: 'comment', nullable: true })
  async getComment(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    return await this.commentsService.findOne(id, info);
  }

  // все комментарии
  @Query(() => [Comment], { name: 'comments' })
  async getComments(@Info() info: GraphQLResolveInfo) {
    return await this.commentsService.findAll(info);
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
