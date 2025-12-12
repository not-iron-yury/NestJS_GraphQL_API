import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';

export const buildPrismaSelect = (info: GraphQLResolveInfo) => {
  const selectObj = new PrismaSelect(info).value;
  return selectObj;
};

// new PrismaSelect(info) парсит GraphQL-AST.
// .value генерирует { select: … } или { include: … } автоматически.
