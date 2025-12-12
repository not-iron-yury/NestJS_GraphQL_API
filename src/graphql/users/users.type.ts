import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/graphql/comments/comments.type';
import { Post } from 'src/graphql/posts/posts.type';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // --------- отношения ---------
  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Comment])
  comments: Comment[];
}
