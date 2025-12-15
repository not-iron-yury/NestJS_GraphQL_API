import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @Length(3, 100)
  title: string;

  @Field(() => String)
  @Length(10, 5000)
  content: string;

  @Field(() => String)
  @Length(10, 30)
  authorId: string;
}

@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(3, 100)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(10, 5000)
  content?: string;
}
