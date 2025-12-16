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
  @Field(() => [Post], { nullable: true }) // возвращаем массив или игнорируем
  posts?: Post[];

  @Field(() => [Comment]) // возвращаем массив в любом случае (с данными, или без)
  comments: Comment[];
}

/**
 * Вариант 1 (самое жесткое ограничение)
 *
 * @Field(() => [Post])
 * posts: Post[];
 *
 * Возможные состояния:
 * 1. Массив с данными
 * 2. Пустой массив []
 *
 * Обязательно присутствует в ответе.
 *
 *---------
 *
 * Вариант 2 (данные или null)
 *
 * @Field(() => [Post], { nullable: true })
 * posts: Post[] | null;
 *
 * Возможные состояния:
 * 1. Массив с данными
 * 2. null
 *
 * Обязательно присутствует в ответе.
 *
 *---------
 *
 * Вариант 3 (не null)
 *
 * @Field(() => [Post], { nullable: true })
 * posts?: Post[];
 *
 * Возможные состояния:
 * 1. Массив с данными
 * 2. Пустой массив []
 * 3. Полностью игнорируется (не попадает в ответ).
 *
 *---------
 *
 * Вариант 4 (самый гибкий)
 *
 * @Field(() => [Post], { nullable: true })
 * posts?: Post[] | null;
 *
 * Возможные состояния:
 * 1. Массив с данными
 * 2. Пустой массив []
 * 3. null
 * 4. Полностью игнорируется (не попадает в ответ).
 *
 */

/**
 * ВАЖНО!
 *
 * { nullable: true } управляет возможностями схемы GraphQL.
 * Концепция Post[] | null связана с контролем типов в TypeScript.
 *
 * Оператор ? — позволяет пропустить поле полностью из ответа.
 * Если в результате запроса нет соответствующих данных (например, нет постов), поле posts просто не попадёт в итоговый JSON-ответ.
 */
