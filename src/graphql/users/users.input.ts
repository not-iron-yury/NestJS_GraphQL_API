import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;
}

// GraphQL всегда разделяет input и output — в отличие от REST, где модель может быть одна.
