import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  @Length(3, 500)
  text: string;

  @Field(() => String)
  @Length(10, 30)
  authorId: string;

  @Field(() => String)
  @Length(10, 30)
  postId: string;
}

@InputType()
export class UpdateCommentInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 500)
  text?: string;
}
