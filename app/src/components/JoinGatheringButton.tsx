import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { ImPlus, ImCross } from 'react-icons/im';

import Button, { Props as ButtonProps } from './Button';

type Props = {
  gatheringId: number;
  leave: boolean;
} & ButtonProps;

const JOIN_GATHERING = gql`
  mutation JoinGathering($gatheringId: Int!, $leave: Boolean!) {
    joinGathering(gatheringId: $gatheringId, leave: $leave) {
      success
    }
  }
`;

const JoinGatheringButton = ({ gatheringId, leave, ...rest }: Props) => {
  const [joinGathering, { loading }] = useMutation(JOIN_GATHERING);

  const handleClick = React.useCallback(() => {
    joinGathering({ variables: { gatheringId, leave } });
  }, [joinGathering, gatheringId, leave]);

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      tooltip={leave ? 'Leave' : 'Join'}
      round
      {...rest}
    >
      {leave ? <ImCross /> : <ImPlus />}
    </Button>
  );
};

export default JoinGatheringButton;
