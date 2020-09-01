import React from 'react';
import { createUseStyles } from 'react-jss';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { motion } from 'framer-motion';

import { TownerContext } from './TownerProvider';
import Button from './Button';
import PureGatheringBox from './PureGatheringBox';

const JOIN_TOWNER = gql`
  mutation JoinTowner($townerId: Int!) {
    joinTowner(townerId: $townerId) {
      success
      gatheringId
    }
  }
`;

const GET_ACTIVE_GATHERING = gql`
  subscription GetActiveGathering($townerId: Int!) {
    participant(where: { towner_id: { _eq: $townerId } }, limit: 1) {
      id
      gathering {
        id
      }
    }
  }
`;

const DummyGatheringBox = () => {
  const classes = useStyles();
  const { townerId } = React.useContext(TownerContext);
  const { data } = useSubscription(GET_ACTIVE_GATHERING, {
    variables: { townerId },
  });
  const [createGathering, { loading }] = useMutation(JOIN_TOWNER);
  const [show, setShow] = React.useState(true);

  const handleClick = React.useCallback(() => {
    setShow(false);
    createGathering({ variables: { townerId } });
  }, [createGathering, townerId, setShow]);

  React.useEffect(() => {
    if (data && data.participant[0].gathering) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [data, setShow]);

  const menu = (
    <Button onClick={handleClick} loading={loading}>
      Create
    </Button>
  );

  if (!show) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId="gathering-new"
    >
      <PureGatheringBox id={0} menu={menu}>
        <div className={classes.DummyGatheringBox}>New Gathering</div>
      </PureGatheringBox>
    </motion.div>
  );
};

const useStyles = createUseStyles({
  DummyGatheringBox: {
    alignItems: 'center',
    color: '#aaa',
    display: 'flex',
    fontSize: 20,
    fontWeight: 'bold',
    height: 64,
    textAlign: 'center',
    userSelect: 'none',
  },
});

export default DummyGatheringBox;
