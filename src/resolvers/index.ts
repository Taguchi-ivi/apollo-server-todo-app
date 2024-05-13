import { Resolvers } from '../generated/graphql';
import * as mutation from './mutation/';
import * as query from './query/';

const resolvers: Resolvers = {
  Query: query,
  Mutation: mutation,
  Date: dateScalar,
};
