import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsString()
  @Length(3, 100)
  title: string;

  @Field(() => String)
  @Length(10, 5000)
  content: string;

  @Field(() => String)
  @Length(10, 30)
  authorId: string;
}
