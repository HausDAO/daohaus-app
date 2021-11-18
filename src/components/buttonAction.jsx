import React, { useEffect, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import ProgressIndicator from './progressIndicator';
import { handleCustomAwait } from '../utils/customAwait';

const ButtonAction = props => {
  const {
    btnText,
    btnNextCallback,
    btnLoadingText,
    btnCallback,
    goToNext,
    setStepperStorage,
    stepperStorage,
    btnLabel,
    next,
  } = props;
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState('');
  const indicatorStates = {
    connected: {
      icon: BiErrorCircle,
      title: 'Connected to Ceramic Network',
      explorerLink: true,
    },
    loadingStepper: {
      icon: BiErrorCircle,
      title: 'Connected to Ceramic Network',
      explorerLink: true,
    },
    failed: {
      icon: BiErrorCircle,
      title: 'Failed to connect please try again',
      explorerLink: true,
    },
  };

  const setValue = (key, value) => {
    setStepperStorage(prevState => ({ ...prevState, [key]: value }));
  };

  const handleClick = async () => {
    // try / except with progress indicator
    // Pass in stepper storage
    // then in form pass in
    await btnCallback(setValue, setLoading, setFormState);
  };

  useEffect(async () => {
    if (btnNextCallback(stepperStorage) && formState === 'success') {
      if (next?.type === 'awaitCustom') {
        await handleCustomAwait(
          next?.awaitDef,
          () => goToNext(next.next),
          setLoading,
          setValue,
          stepperStorage,
        );
      } else {
        await goToNext(next);
      }
    }
  }, [stepperStorage, formState]);

  console.log('Form state');
  console.log(formState);
  return (
    <>
      <Flex flexDirection='row' mb={3}>
        <Flex flexDirection='column'>
          <h4>{btnLabel}</h4>
          <Button
            type='button'
            loadingText={btnLoadingText}
            isLoading={loading}
            onClick={() => handleClick()}
          >
            {btnText}
          </Button>
        </Flex>
      </Flex>
      <ProgressIndicator currentState={formState} states={indicatorStates} />
    </>
  );
};

export default ButtonAction;

//    <Flex
//      w={width}
//      mb={mb || 3}
//      flexDir='column'
//      {...containerProps}
//      hidden={hidden}
//    >
//      <Flex>
//        <TextBox
//          as={FormLabel}
//          size='xs'
//          htmlFor={htmlFor || name}
//          position='relative'
//        >
//          {registerOptions?.required && (
//            <Box display='inline' position='absolute' left='-1rem'>
//              {'* '}
//            </Box>
//          )}
//          {label}
//          {info && (
//            <ToolTipWrapper
//              tooltip
//              tooltipText={{ body: info }}
//              placement='right'
//              layoutProps={{
//                transform: 'translateY(-2px)',
//                display: 'inline-block',
//              }}
//            >
//              <Icon as={RiInformationLine} ml={2} />
//            </ToolTipWrapper>
//          )}
//        </TextBox>
//        {btn && <Flex ml='auto'>{btn}</Flex>}
//      </Flex>
//
//      {children}
//      {helperText && <FormHelperText>{helperText}</FormHelperText>}
//      {fieldError && <ErrorList singleError={fieldError} />}
