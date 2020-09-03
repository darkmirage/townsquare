import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng';

import { getScreenTrack } from 'agoraClient';
import { VideoContext } from './VideoProvider';

type Props = {
  names?: { name: string; userId: number }[];
};

const ActiveCanvas = ({ names = [] }: Props) => {
  const classes = useStyles();
  const ref = React.useRef<HTMLDivElement>(null);
  const { userId, playing, videoTrack } = React.useContext(VideoContext);
  const [localTrack, setLocalTrack] = React.useState<ILocalVideoTrack | null>(
    null
  );
  const [fullScreen, setFullScreen] = React.useState(false);
  const isLive = !!localTrack || playing;

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const track = getScreenTrack();
      setLocalTrack(track);
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, [setLocalTrack]);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (videoTrack) {
      videoTrack.play(ref.current);
    } else if (localTrack) {
      localTrack.play(ref.current);
    } else {
      ref.current.firstChild?.remove();
    }
  }, [videoTrack, localTrack]);

  const handleClick = React.useCallback(() => {
    setFullScreen((f) => !f);
  }, [setFullScreen]);

  const presenter = names.filter((n) => n.userId === userId)[0];
  return (
    <div
      className={classNames(classes.ActiveCanvas, {
        [classes.ActiveCanvas_live]: isLive,
        [classes.ActiveCanvas_full]: fullScreen,
      })}
      onClick={handleClick}
    >
      <div className={classes.ActiveCanvas_canvas} ref={ref}></div>
      {presenter ? (
        <div className={classes.ActiveCanvas_presenter}>{presenter.name}</div>
      ) : null}
    </div>
  );
};

const useStyles = createUseStyles({
  ActiveCanvas: {
    background: '#000',
    display: 'none',
    height: 450,
    marginBottom: 8,
    marginTop: 8,
    opacity: 0,
    position: 'relative',
    transform: 'scale(0.1)',
    transition: 'opacity 300ms, transform 400ms',
    width: 800,
    '@media (max-width: 960px)': {
      height: 180,
      width: 320,
    },
  },
  ActiveCanvas_full: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    margin: 0,
    zIndex: 1000,
  },
  ActiveCanvas_canvas: {
    height: '100%',
    width: '100%',
  },
  ActiveCanvas_presenter: {
    background: '#333',
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
    left: 8,
    marginLeft: 4,
    padding: 4,
    pointerEvents: 'none',
    position: 'absolute',
    top: 8,
    zIndex: 20,
  },
  ActiveCanvas_live: {
    display: 'block',
    opacity: 1.0,
    transform: 'scale(1.0)',
  },
});

export default ActiveCanvas;
