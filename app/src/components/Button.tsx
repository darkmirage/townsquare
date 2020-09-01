import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  loading?: boolean;
};

const Button = ({ className, children, loading = false, ...rest }: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.Button, className)}
      role="button"
      {...rest}
    >
      {children}
    </div>
  );
};

const useStyles = createUseStyles({
  Button: {
    background: '#808080',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    padding: '4px 8px',
    transition: 'color 200ms, filter 200ms',
    userSelect: 'none',
    '&:hover': {
      filter: 'brightness(90%)',
    },
  },
});

export default Button;
