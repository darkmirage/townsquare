import React from 'react';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';

import Button, { Props as ButtonProps } from './Button';
import { publishScreen, unpublishScreen } from 'agoraClient';
import { VideoContext } from './VideoProvider';

const ShareScreenButton = ({ ...rest }: ButtonProps) => {
  const [loading, setLoading] = React.useState(false);
  const [sharing, setSharing] = React.useState(false);
  const { playing } = React.useContext(VideoContext);

  const handleClick = React.useCallback(() => {
    if (sharing) {
      setLoading(true);
      unpublishScreen().then(() => {
        setLoading(false);
        setSharing(false);
      });
    } else {
      setLoading(true);
      publishScreen()
        .then(() => {
          setLoading(false);
          setSharing(true);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [setLoading, setSharing, sharing]);

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      tooltip={sharing ? 'Stop sharing' : 'Share screen'}
      disabled={playing}
      round
      {...rest}
    >
      {sharing ? <MdStopScreenShare /> : <MdScreenShare />}
    </Button>
  );
};

export default ShareScreenButton;
