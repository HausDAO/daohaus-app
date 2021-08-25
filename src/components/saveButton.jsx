import { Button } from '@chakra-ui/button';
import deepEqual from 'deep-equal';
import React, { useEffect, useRef, useState } from 'react';

import { HASH } from '../utils/general';

const SaveButton = props => {
  const { watch, disabled } = props;
  const [isSame, setSame] = useState(true);

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

  return <Button {...props} disabled={disabled || isSame} />;
};

export default SaveButton;
