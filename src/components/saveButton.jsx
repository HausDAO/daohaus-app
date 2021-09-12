import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@chakra-ui/button';
import deepEqual from 'deep-equal';

import { useHistory } from 'react-router-dom';
import { HASH } from '../utils/general';
import { useConfirmation } from '../contexts/OverlayContext';

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
  } = props;
  const [isSame, setSame] = useState(true);
  const history = useHistory();
  const { openConfirmation, closeModal } = useConfirmation();

  const startingVals = useRef(HASH.AWAITING_VALUE);

  useEffect(() => {
    if (watch != null && startingVals.current === HASH.AWAITING_VALUE) {
      startingVals.current = { ...watch };
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
            console.log(tx);
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

  return (
    <Button size='md' disabled={disabled || isSame} onClick={saveFn}>
      {children}
    </Button>
  );
};

export default SaveButton;
