import React from 'react';
import { gql, useMutation } from '@apollo/client';

import { PRESENCE_WS_URL } from 'config';
import { AuthContext } from './AuthProvider';
import Spinner from './Spinner';

const GET_OR_CREATE_TOWNER = gql`
  mutation GetOrCreateTowner($domain: String!) {
    getOrCreateTowner(domain: $domain) {
      success
      townerId
    }
  }
`;

const ws = new WebSocket(PRESENCE_WS_URL);

type TownerContextType = {
  townerId: number;
};

type Props = {
  domain: string;
  unauthorized: React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

const defaultContext: TownerContextType = {
  townerId: 0,
};

export const TownerContext = React.createContext<TownerContextType>(
  defaultContext
);

const TownerProvider = (props: Props) => {
  const { domain } = props;
  const { user } = React.useContext(AuthContext);
  const [context, setContext] = React.useState(defaultContext);
  const [error, setError] = React.useState(false);
  const [getOrCreateTowner, { data, loading }] = useMutation(
    GET_OR_CREATE_TOWNER
  );

  React.useEffect(() => {
    if (user) {
      getOrCreateTowner({ variables: { domain } });
    }
  }, [user, getOrCreateTowner, domain]);

  React.useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
    const { townerId, success } = data.getOrCreateTowner;
    if (success && townerId) {
      ws.send(townerId);
      setContext({ townerId });
    } else {
      setError(true);
    }
  }, [data, setContext, setError]);

  if (error) {
    return <>{props.unauthorized}</>;
  }

  return (
    <TownerContext.Provider value={context}>
      {loading || !context.townerId ? <Spinner /> : props.children}
    </TownerContext.Provider>
  );
};

export default TownerProvider;
