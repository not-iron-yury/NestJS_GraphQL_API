import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/graphql/posts/posts.type';
import { User } from 'src/graphql/users/users.type';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  postId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // --------- отношения ---------
  @Field(() => User)
  author: User;

  @Field(() => Post)
  post: Post;
}
