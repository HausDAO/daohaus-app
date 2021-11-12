import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import FieldWrapper from './fieldWrapper';

const GenericButton = props => {
  const {
    btnLabel,
    btnText,
    btnCallback,
    setValue,
    containerProps,
    mb,
    btnLoadingText,
  } = props;
  const [loading, setLoading] = useState(false);

  return (
    <FieldWrapper {...props} containerProps={containerProps} mb={mb}>
      <h4>{btnLabel}</h4>
      <Button
        type='button'
        loadingText={btnLoadingText}
        isLoading={loading}
        onClick={async () => btnCallback(setValue, setLoading)}
      >
        {btnText}
      </Button>
    </FieldWrapper>
  );
};

export default GenericButton;
