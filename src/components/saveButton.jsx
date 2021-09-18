import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@chakra-ui/button';
import deepEqual from 'deep-equal';

import { useHistory } from 'react-router-dom';
import { HASH } from '../utils/general';
import { useConfirmation } from '../contexts/OverlayContext';
import { useAppModal } from '../hooks/useModals';

const dev = process.env.REACT_APP_DEV;

const SaveButton = props => {
  const {
    watch,
    disabled,
    blockRouteOnDiff,
    children,
    title = 'Discard Changes?',
    header = 'You have unsaved changes.',
    description = 'If you would like to sign and save your changes, click save. To erase your changes, click cancel.',
    saveFn,
    undoChanges,
    ignoreDevWarning,
  } = props;
  const [isSame, setSame] = useState(true);
  const history = useHistory();
  const { openConfirmation, closeModal } = useConfirmation();
  const { formModal, confirmModal } = useAppModal();

  const startingVals = useRef(HASH.AWAITING_VALUE);

  useEffect(() => {
    console.log('watchedValue', watch);
    console.log('startingValue', startingVals.current);
    if (watch != null && startingVals.current === HASH.AWAITING_VALUE) {
      console.log('SETTING STARTING VALUE');
      startingVals.current = watch;
      return;
    }
    if (startingVals.current !== HASH.AWAITING_VALUE) {
      const isEqual = deepEqual(watch, startingVals.current);
      console.log(`isEqual`, isEqual);
      setSame(deepEqual(watch, startingVals.current));
    }
  }, [watch]);

  useEffect(() => {
    if (blockRouteOnDiff) {
      const unblock = history.block(tx => {
        if (isSame) return true;

        openConfirmation({
          title,
          header,
          temporary: description,
          async onSubmit() {
            await saveFn?.();
            unblock();
            setSame(true);
            startingVals.current = watch;
          },
          onCancel() {
            closeModal();
            unblock();
            undoChanges?.();
            if (tx?.pathname) {
              history.push(tx.pathname);
            }
          },
        });
        return false;
      });
      return () => {
        unblock();
      };
    }
  }, [isSame, blockRouteOnDiff]);

  const handleTrySave = async () => {
    const updateSaveButton = () => {
      setSame(true);
      startingVals.current = watch;
    };

    if (dev && !ignoreDevWarning) {
      confirmModal({
        subtitle: 'DEV WARNING',
        body:
          'Local DEV builds may have data that is out of sync with the app branch. If you are pushing a form to the DAO metadata, make sure the form exists on the app branch first.',
        secondaryBtn: {
          text: 'Submit Anyway',
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
