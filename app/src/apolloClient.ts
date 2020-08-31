import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

import { refreshToken } from 'jwt';
import { GRAPHQL_WS_URL, GRPAHQL_HTTP_URL } from 'config';

const httpLink = new HttpLink({
  uri: GRPAHQL_HTTP_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await refreshToken();
  const additionalHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    headers: {
      ...headers,
      ...additionalHeaders,
    },
  };
});

const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS_URL,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const token = await refreshToken();
      return token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};
    },
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
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
