import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { ConnectionState } from 'agora-rtc-sdk-ng';
import { motion } from 'framer-motion';
import { ImPencil2 } from 'react-icons/im';

type Props = {
  children: React.ReactNode;
  connectionState?: ConnectionState;
  description?: string;
  onEdit?: ((newDescription: string) => void) | null;
  id: number;
  isActive?: boolean;
  isLocked?: boolean;
  loading?: boolean;
  menu?: React.ReactNode;
  overlay?: React.ReactNode;
  hideHeader?: boolean;
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
  id,
  children,
  connectionState = 'DISCONNECTED',
  description = '',
  onEdit = null,
  isActive = false,
  isLocked = false,
  loading = false,
  menu = null,
  overlay = null,
  hideHeader = false,
}: Props) => {
  const classes = useStyles({ connectionState });
  const [editing, setEditing] = React.useState(false);
  const [desc, setDesc] = React.useState(description);

  const handleEdit = React.useCallback(() => {
    if (onEdit) {
      setEditing(true);
    }
  }, [onEdit, setEditing]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(event.target.value);
    },
    [setDesc]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onEdit && event.key === 'Enter') {
        setEditing(false);
        if (desc) {
          onEdit(desc);
        }
      }
    },
    [setEditing, onEdit, desc]
  );

  const handleBlur = React.useCallback(() => {
    setEditing(false);
    if (onEdit && desc) {
      onEdit(desc);
    }
  }, [setEditing, onEdit, desc]);

  const spinner = loading ? (
    <div className={classes.PureGatheringBox_loader}></div>
  ) : null;

  const connectionMessage = isActive ? (
    <div className={classes.PureGatheringBox_status}>{connectionState}</div>
  ) : null;

  const header = description ? (
    <div
      className={classNames(classes.PureGatheringBox_header, {
        [classes.PureGatheringBox_hide]: hideHeader,
      })}
    >
      <div
        className={classNames(classes.PureGatheringBox_label, {
          [classes.PureGatheringBox_editable]: !!onEdit,
        })}
        onClick={handleEdit}
      >
        {editing ? (
          <textarea
            className={classes.PureGatheringBox_input}
            rows={2}
            value={desc}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={handleBlur}
          ></textarea>
        ) : (
          description
        )}
        {onEdit ? (
          <ImPencil2 className={classes.PureGatheringBox_edit_icon} />
        ) : null}
      </div>
    </div>
  ) : null;

  return (
    <motion.div
      layoutId={`gathering-${id}`}
      className={classNames(classes.PureGatheringBox, {
        [classes.PureGatheringBox_active]: isActive,
        [classes.PureGatheringBox_locked]: isLocked,
      })}
    >
      {header}
      <div className={classes.PureGatheringBox_overlay}>{overlay}</div>
      <div className={classes.PureGatheringBox_content}>{children}</div>
      {connectionMessage}
      <div className={classes.PureGatheringBox_menu}>{menu}</div>
      {spinner}
    </motion.div>
  );
};

const useStyles = createUseStyles({
  PureGatheringBox: {
    background: '#fff',
    border: '4px solid rgba(229, 229, 229)',
    borderRadius: 12,
    marginBottom: 24,
    marginRight: 24,
    marginTop: 28,
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
  PureGatheringBox_input: {
    border: 0,
    outline: 0,
    resize: 'none',
    width: '100%',
  },
  PureGatheringBox_editable: {
    cursor: 'pointer',
  },
  PureGatheringBox_edit_icon: {
    marginLeft: 12,
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
    padding: 8,
    position: 'absolute',
    top: 0,
    transform: 'translateY(calc(-100%))',
    transition: 'opacity 200ms, background 200ms, color 200ms',
    '&:hover': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  PureGatheringBox_hide: {
    opacity: 0,
    visibility: 'hidden',
  },
  PureGatheringBox_label: {
    fontSize: 16,
    fontWeight: 600,
    maxHeight: '2.5em',
    lineHeight: '1.25em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',
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
