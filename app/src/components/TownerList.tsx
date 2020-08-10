import React from 'react';
import { useStoreState } from 'pullstate';

import { TownerStore, TownerID } from 'stores';
import TownerBox from './TownerBox';

type Props = {
  townerIds: TownerID[];
};

const TownerList = (props: Props) => {
  const { loading } = useStoreState(TownerStore);

  if (loading) {
    return null;
  }

  const elems = props.townerIds.map((id) => <TownerBox key={id} id={id} />);

  return (
    <div>
      List:
      {elems}
    </div>
  );
};

export default TownerList;
