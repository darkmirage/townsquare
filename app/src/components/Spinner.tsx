import React from 'react';
import classNames from 'classnames';

import './Spinner.css';

const Spinner = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const className = classNames('lds-ring', props.className);
  return (
    <div className={className}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
