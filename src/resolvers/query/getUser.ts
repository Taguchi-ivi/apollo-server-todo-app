import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../lib/prisma';

export const getUser: QueryResolvers['getUser'] = async (
  parent,
  args,
  context,
  info
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: context.user?.id,
    },
  });
  return user;
};
