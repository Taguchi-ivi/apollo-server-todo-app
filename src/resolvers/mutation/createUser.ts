import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../lib/prisma';

export const createUser: MutationResolvers['createUser'] = async (
  parent,
  args,
  context,
  info
) => {
  const userId = context.user?.id;
  if (!userId) {
    throw new Error('Authentication Error.');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user) {
    throw new Error('User already exists.');
  }

  const createUser = await prisma.user.create({
    data: {
      id: userId,
      name: args.input.name,
    },
  });
  return createUser;
};
