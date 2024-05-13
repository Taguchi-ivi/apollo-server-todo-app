import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../lib/prisma';

export const getTodos: QueryResolvers['getTodos'] = async (
  parent,
  args,
  context,
  info
) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: context.user?.id,
    },
    include: {
      user: true,
    },
  });
  return todos;
};
