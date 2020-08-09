import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useStoreState } from 'pullstate';

import { SquareStore } from 'stores';
import Spinner from './Spinner';
import TownerList from './TownerList';

const SquareScreen = (
  props: RouteComponentProps<{ squareId: string }, {}, undefined>
) => {
  const classes = useStyles();
  const squareId = props.match.params['squareId'];

  const { square, loading } = useStoreState(SquareStore);

  React.useEffect(() => {
    SquareStore.update((s) => {
      s.id = squareId;
    });
  }, [squareId]);

  return (
    <div className={classes.SquareScreen}>
      {squareId}
      {loading ? <Spinner /> : <TownerList townerIds={square.towners} />}
    </div>
  );
};

const useStyles = createUseStyles({
  SquareScreen: {
    minWidth: 400,
    minHeight: 400,
  },
});

export default SquareScreen;
