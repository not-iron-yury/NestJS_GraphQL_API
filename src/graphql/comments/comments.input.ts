import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  text: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  postId: string;
}
