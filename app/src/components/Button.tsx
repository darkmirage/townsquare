import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

export type Props = React.ComponentPropsWithoutRef<'div'> & {
  loading?: boolean;
  round?: boolean;
  tooltip?: string;
  disabled?: boolean;
};

const Button = ({
  className,
  children,
  loading = false,
  round = false,
  tooltip = '',
  disabled = false,
  ...rest
}: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classNames(
        classes.Button,
        {
          [classes.Button_round]: round,
          [classes.Button_disabled]: disabled || loading,
        },
        className
      )}
      role="button"
      {...rest}
    >
      {children}
      {tooltip ? <div className={classes.Button_tooltip}>{tooltip}</div> : null}
    </div>
  );
};

const useStyles = createUseStyles({
  Button: {
    background: '#999',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    padding: '4px 8px',
    position: 'relative',
    transition: 'color 200ms, filter 200ms',
    userSelect: 'none',
    '&:hover': {
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
      filter: 'brightness(90%)',
      '& $Button_tooltip': {
        opacity: 1,
        visibility: 'visible',
      },
    },
  },
  Button_disabled: {
    opacity: 0.5,
    cursor: 'default',
    pointerEvents: 'none',
  },
  Button_round: {
    alignItems: 'center',
    borderRadius: 16,
    display: 'flex',
    height: 32,
    justifyContent: 'center',
    padding: 0,
    width: 32,
  },
  Button_tooltip: {
    background: '#333',
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
    left: '50%',
    opacity: 0,
    padding: 4,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transform: 'translate(-50%, calc(-100% - 4px))',
    transition: '200ms',
    visibility: 'hidden',
  },
});

export default Button;
