import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 15)
  name?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 15)
  name?: string;
}
