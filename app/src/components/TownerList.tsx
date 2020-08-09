import React from 'react';
import { useStoreState } from 'pullstate';

import { TownerStore, TownerID } from 'stores';

type Props = {
  townerIds: TownerID[];
};

const TownerList = (props: Props) => {
  const { townerMap, loading } = useStoreState(TownerStore);

  if (loading) {
    return null;
  }

  const elems = props.townerIds.map((id) => {
    const towner = townerMap[id];
    return <div key={id}>{towner.displayName}</div>;
  });

  return (
    <div>
      List:
      {elems}
    </div>
  );
};

export default TownerList;
