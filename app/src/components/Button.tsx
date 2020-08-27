import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  loading: boolean;
};

const Button = ({ loading = false, ...props }: Props) => {
  const classes = useStyles();
  const { className, children, ...rest } = props;

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
    background: '#a82a2a',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    padding: '4px 8px',
    transition: '200ms',
    '&:hover': {
      filter: 'brightness(90%)',
    },
  },
});

export default Button;
