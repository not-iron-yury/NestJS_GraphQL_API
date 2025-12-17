import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

export const notFound = (entity: string) =>
  new GraphQLError(`${entity} not found`, {
    extensions: { code: 'NOT_FOUND' },
  });

export const conflict = (message: string) =>
  new GraphQLError(message, {
    extensions: { code: 'CONFLICT' },
  });

export const badInput = (message: string) =>
  new GraphQLError(message, {
    extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
  });

export const internalError = () =>
  new GraphQLError('Internal server error', {
    extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
  });
