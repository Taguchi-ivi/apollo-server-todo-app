import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { loadSchemaSync } from '@graphql-tools/load';

const schema = loadSchemaSync('src/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const books = [
  { title: 'The Awakening', author: 'Kate Chopin' },
  { title: 'City of Glass', author: 'Paul Auster' },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  schema: schemaWithResolvers,
});

// const { url } = await startStandaloneServer(server, {
//   context: async ({ req }) => ({
//     ...req,
//     prisma,
//     userId: req && req.headers.authorization ? getUserId(req) : null,
//   }),
//   listen: { port: 4000 },
// });
const { url } = await startStandaloneServer(server, {
  context: async (ctx) => {
    const token = ctx.req.headers.authorization?.replace('Bearer ', '');
    if (token === undefined) {
      return {
        user: undefined,
      };
    }
    try {
      const user = await new Promise<JwtPayload>((resolve, reject) => {
        const client = jwksClient({
          jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
        });
        jwt.verify(
          token,
          (header, cb) => {
            client.getSigningKey(header.kid, function (err, key) {
              const signingKey = key.getPublicKey();
              cb(null, signingKey);
            });
          },
          {
            audience: `${AUTH0_AUDIENCE}`,
            issuer: `${AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) {
              return reject(err);
            }
            if (decoded === undefined) {
              return reject('decoded is invalid.');
            }
            resolve(decoded);
          }
        );
      });

      const userInfo = await fetch(`${AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      return {
        user: {
          id: user.sub,
          name: userInfo.nickname,
          email: userInfo.email,
        },
      } as Context;
    } catch (error) {
      return {
        user: undefined,
      };
    }
  },
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
