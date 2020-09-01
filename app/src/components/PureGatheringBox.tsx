import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { ConnectionState } from 'agora-rtc-sdk-ng';

type Props = {
  connectionState: ConnectionState;
  isActive: boolean;
  isLocked: boolean;
  description: string;
  children: React.ReactNode;
  menu?: React.ReactNode;
  overlay?: React.ReactNode;
  loading: boolean;
};

function getColor(connectionState: ConnectionState): string {
  let borderColor = '0, 0, 0';
  switch (connectionState) {
    case 'CONNECTED':
      borderColor = '0, 176, 255';
      break;
    case 'RECONNECTING':
    case 'CONNECTING':
      borderColor = '127, 127, 127';
      break;
    case 'DISCONNECTED':
    case 'DISCONNECTING':
      borderColor = '255, 81, 0';
      break;
    default:
      break;
  }
  return borderColor;
}

const PureGatheringBox = ({
  children,
  connectionState,
  isActive,
  isLocked,
  description,
  loading,
  menu = null,
  overlay = null,
}: Props) => {
  const classes = useStyles({ connectionState });

  const spinner = loading ? (
    <div className={classes.PureGatheringBox_loader}></div>
  ) : null;

  const connectionMessage = isActive ? (
    <div className={classes.PureGatheringBox_status}>{connectionState}</div>
  ) : null;

  return (
    <div
      className={classNames(classes.PureGatheringBox, {
        [classes.PureGatheringBox_active]: isActive,
        [classes.PureGatheringBox_locked]: isLocked,
      })}
    >
      <div className={classes.PureGatheringBox_header}>
        <div className={classes.PureGatheringBox_label}>{description}</div>
      </div>
      <div className={classes.PureGatheringBox_overlay}>{overlay}</div>
      <div className={classes.PureGatheringBox_content}>{children}</div>
      {connectionMessage}
      <div className={classes.PureGatheringBox_menu}>{menu}</div>
      {spinner}
    </div>
  );
};

const useStyles = createUseStyles({
  PureGatheringBox: {
    background: '#fff',
    border: '4px solid rgba(229, 229, 229)',
    borderRadius: 12,
    marginBottom: 24,
    marginRight: 24,
    position: 'relative',
    transition: 'background 200ms, border 200ms',
    '&:hover': {
      background: '#eee',
      '& $PureGatheringBox_menu': {
        opacity: 1.0,
      },
      '& $PureGatheringBox_header': {
        visibility: 'visible',
        opacity: 1,
      },
      '& $PureGatheringBox_overlay': {
        visibility: 'visible',
        opacity: 1,
      },
    },
  },
  PureGatheringBox_overlay: {
    color: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    padding: 8,
    position: 'absolute',
    transition: 'opacity 200ms',
    visibility: 'hidden',
    zIndex: 3,
  },
  PureGatheringBox_locked: {
    '& $PureGatheringBox_overlay': {
      visibility: 'visible',
      opacity: 1,
    },
    '& $PureGatheringBox_menu': {
      display: 'none',
    },
  },
  PureGatheringBox_content: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 240,
    minWidth: 160,
    padding: 12,
  },
  PureGatheringBox_active: ({ connectionState }) => ({
    border: `4px solid rgb(${getColor(connectionState)})`,
    '&:hover': {
      background: `rgba(${getColor(connectionState)}, 0.1)`,
    },
    '& $PureGatheringBox_header': {
      color: '#fff',
      background: `rgb(${getColor(connectionState)})`,
    },
    '& $PureGatheringBox_content': {
      padding: 24,
      paddingBottom: 32,
    },
  }),
  PureGatheringBox_status: ({ connectionState }) => ({
    background: `rgb(${getColor(connectionState)})`,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    bottom: 0,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    left: 0,
    paddingLeft: 4,
    paddingRight: 8,
    paddingTop: 4,
    pointerEvents: 'none',
    position: 'absolute',
  }),
  PureGatheringBox_loader: {
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.1)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  PureGatheringBox_header: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    background: 'rgba(229, 229, 229)',
    opacity: 0,
    padding: 8,
    position: 'absolute',
    top: 0,
    transform: 'translateY(calc(-100%))',
    transition: 'opacity 200ms, background 200ms, color 200ms',
    visibility: 'hidden',
    '&:hover': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  PureGatheringBox_label: {
    fontSize: 16,
    fontWeight: 600,
    maxHeight: '2.5em',
    lineHeight: '1.25em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  PureGatheringBox_menu: {
    bottom: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    transform: 'translate(-8px, 16px)',
    transition: '200ms',
  },
});

export default PureGatheringBox;
