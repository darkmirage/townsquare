import React from 'react';
import { gql, useSubscription, useLazyQuery } from '@apollo/client';

import { TownerContext } from './TownerProvider';
import AgoraChannel from './AgoraChannel';
import { userIdToUid } from 'agoraClient';

const GET_ACTIVE_GATHERING = gql`
  subscription GetActiveGathering($townerId: Int!) {
    participant(where: { towner_id: { _eq: $townerId } }, limit: 1) {
      id
      gathering {
        id
        channel
      }
      towner {
        user_id
      }
    }
  }
`;

const GET_AGORA_TOKEN = gql`
  query GetAgoraToken {
    agora {
      success
      token
    }
  }
`;

const ActiveGathering = () => {
  const { townerId } = React.useContext(TownerContext);
  const { data, loading } = useSubscription(GET_ACTIVE_GATHERING, {
    variables: { townerId },
  });
  const [
    getAgoraToken,
    { data: tokenData, refetch, loading: tokenLoading },
  ] = useLazyQuery(GET_AGORA_TOKEN);

  React.useEffect(() => {
    if (data) {
      const fetch = refetch || getAgoraToken;
      fetch();
    }
  }, [data, getAgoraToken, refetch]);

  const channel = data
    ? (data.participant[0].gathering?.channel as string)
    : null;
  const userId = data ? (data.participant[0].towner.user_id as number) : null;
  const token = tokenData ? (tokenData.agora.token as string) : null;

  if (loading || tokenLoading) {
    return null;
  }

  return channel && token && userId ? (
    <AgoraChannel channel={channel} token={token} uid={userIdToUid(userId)} />
  ) : null;
};

export default ActiveGathering;
