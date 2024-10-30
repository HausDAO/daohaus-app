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
    btnHideCallback,
    setFormState,
    values,
  } = props;
  const [loading, setLoading] = useState(false);
  const hideButton =
    typeof btnHideCallback === 'function' ? btnHideCallback(values) : false;

  return (
    <FieldWrapper {...props} containerProps={containerProps} mb={mb}>
      {hideButton ? (
        <></>
      ) : (
        <>
          <h4>{btnLabel}</h4>
          <Button
            type='button'
            loadingText={btnLoadingText}
            isLoading={loading}
            onClick={async () =>
              btnCallback(setValue, setLoading, setFormState)
            }
          >
            {btnText}
          </Button>
        </>
      )}
    </FieldWrapper>
  );
};

export default GenericButton;
