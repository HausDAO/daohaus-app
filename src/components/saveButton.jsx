import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import deepEqual from 'deep-equal';

import { useAppModal } from '../hooks/useModals';
import { HASH } from '../utils/general';

const dev = process.env.REACT_APP_DEV;

const SaveButton = props => {
  const {
    watch,
    disabled,
    blockRouteOnDiff,
    children,
    subtitle = 'Discard Changes?',
    title = 'You have unsaved changes.',
    description = 'If you would like to sign and save your changes, click save. To erase your changes, click cancel.',
    saveFn,
    undoChanges,
    ignoreDevWarning,
  } = props;
  const [isSame, setSame] = useState(true);
  const history = useHistory();
  const { confirmModal, closeModal } = useAppModal();

  const startingVals = useRef(HASH.AWAITING_VALUE);

  useEffect(() => {
    if (watch != null && startingVals.current === HASH.AWAITING_VALUE) {
      startingVals.current = watch;
      return;
    }
    if (startingVals.current !== HASH.AWAITING_VALUE) {
      setSame(deepEqual(watch, startingVals.current));
    }
  }, [watch]);

  useEffect(() => {
    if (blockRouteOnDiff) {
      const unblock = history.block(tx => {
        if (isSame) return true;
        confirmModal({
          title,
          subtitle,
          description,
          primaryBtn: {
            text: 'Sign',
            fn: async () => {
              await saveFn?.();
              unblock();
              setSame(true);
              startingVals.current = watch;
            },
          },
          secondaryBtn: {
            text: 'Discard Changes',
            fn: () => {
              closeModal();
              unblock();
              undoChanges?.();
              if (tx?.pathname) {
                history.push(tx.pathname);
              }
            },
          },
        });
        return false;
      });
      return () => {
        unblock();
      };
    }
  }, [isSame, blockRouteOnDiff]);

  const handleTrySave = () => {
    const updateSaveButton = () => {
      setSame(true);
      startingVals.current = watch;
    };

    if (dev && !ignoreDevWarning) {
      confirmModal({
        subtitle: 'sync warning',
        title: 'Warning for devs',
        body:
          'Local DEV builds may have data that is out of sync with the app branch. If you are pushing a form to the DAO metadata, make sure the form exists on the app branch first.',
        secondaryBtn: {
          text: 'Sign Anyway',
          fn: () => {
            closeModal();
            saveFn?.(updateSaveButton);
          },
        },
        primaryBtn: {
          text: 'Got it',
          fn: closeModal,
        },
      });
    } else {
      saveFn?.(updateSaveButton);
    }
  };

  return (
    <Button size='md' disabled={disabled || isSame} onClick={handleTrySave}>
      {children}
    </Button>
  );
};

export default SaveButton;
