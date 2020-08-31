import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

type Props = {
  isOnline: boolean;
  isAway: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

const OnlineIndicator = ({ isOnline, isAway, className }: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.OnlineIndicator, className, {
        [classes.OnlineIndicator_visible]: isOnline,
        [classes.OnlineIndicator_away]: isAway,
      })}
    ></div>
  );
};

const useStyles = createUseStyles({
  OnlineIndicator: {
    background: '#0f0',
    borderRadius: 8,
    height: 16,
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 200ms, background 200ms',
    width: 16,
  },
  OnlineIndicator_away: {
    background: '#ffa600',
  },
  OnlineIndicator_visible: {
    opacity: 1,
  },
});

export default OnlineIndicator;
