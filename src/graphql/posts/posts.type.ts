import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/graphql/comments/comments.type';
import { User } from 'src/graphql/users/users.type';

@ObjectType()
export class Post {
  @Field(() => String) // GraphQL поле
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => String)
  authorId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // --------- отношения ---------
  @Field(() => User)
  author: User;

  @Field(() => [Comment])
  comments: Comment[];
}
