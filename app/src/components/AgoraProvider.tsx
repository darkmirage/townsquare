import React from 'react';
import { ConnectionState } from 'agora-rtc-sdk-ng';

import agoraClient from '../agoraClient';

type AgoraContextType = {
  connectionState: ConnectionState;
};

const defaultContext: AgoraContextType = {
  connectionState: agoraClient.connectionState,
};

export const AgoraContext = React.createContext<AgoraContextType>(
  defaultContext
);

const AgoraProvider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const [context, setContext] = React.useState(defaultContext);

  React.useEffect(() => {
    agoraClient.on('connection-state-change', (state) => {
      setContext({ connectionState: state });
    });
  }, []);

  return (
    <AgoraContext.Provider value={context}>
      {props.children}
    </AgoraContext.Provider>
  );
};

export default AgoraProvider;
