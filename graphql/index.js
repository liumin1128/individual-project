import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import { formatError } from 'apollo-errors';
import typeDefs from './schema';
import resolvers from './resolvers';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const graphql = graphqlKoa((ctx) => {
  const { user = {} } = ctx.state;
  return {
    schema,
    formatError,
    // context: { user: user.data, ...ctx },
    context: { user: '5b44bf8fd9c4bd0bbdfd097d' },
  };
});

export const graphiql = graphiqlKoa({
  endpointURL: '/graphql',
});
