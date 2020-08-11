import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const GRPAHQL_HTTP_URL = 'http://raven-ubuntu:8080/v1/graphql';
const GRAPHQL_WS_URL = 'ws://raven-ubuntu:8080/v1/graphql';

const httpLink = new HttpLink({
  uri: GRPAHQL_HTTP_URL,
});

const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS_URL,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
