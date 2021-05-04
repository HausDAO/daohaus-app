import React from 'react';
import {
  Box,
  Flex,
  Button,
  InputGroup,
  FormLabel,
  Input,
  InputRightAddon,
  Link,
  Text,
} from '@chakra-ui/react';

import ContentBox from './ContentBox';

const StakeCard = props => {
  const {
    title,
    description,
    reward,
    inputLabel,
    inputMax,
    submitBtn,
    farmHausRedirect,
    register,
    error,
    ...rest
  } = props;

  const handleSubmit = () => {
    submitBtn?.fn();
  };

  return (
    <ContentBox
      d='flex'
      minWidth='280px'
      width='100%'
      maxWidth='400px'
      mr={4}
      mb={4}
      {...rest}
      flexDirection='column'
      alignItems='center'
      justifyContent='space-around'
    >
      <Box fontFamily='heading' fontSize='2xl' mb={3} fontWeight={700}>
        {title}
      </Box>
      <Box fontSize='sm' textTransform='center'>
        {description}
      </Box>
      <Box fontSize='sm' textAlign='center' mb={3}>
        {reward}
      </Box>
      {farmHausRedirect ? (
        <Button
          as={Link}
          href='https://farm.daohaus.club/farms'
          isExternal
          px='2.5rem'
          mb={5}
          textTransform='uppercase'
          onClick={handleSubmit}
        >
          {submitBtn?.label}
        </Button>
      ) : (
        <>
          <Flex
            maxWidth='250px'
            width='100%'
            minWidth='200px'
            justifyContent='flex-start'
          >
            <Box as={FormLabel} fontSize='xs' color='whiteAlpha.700'>
              {inputLabel}
            </Box>
          </Flex>
          <InputGroup
            maxWidth='250px'
            width='100%'
            minWidth='200px'
            justifyContent='center'
          >
            <Input
              placeholder='0'
              mb={5}
              color='white'
              focusBorderColor='secondary.500'
              name='daoAddress'
              ref={register()}
            />
            {inputMax && (
              <InputRightAddon background='primary.500' p={0}>
                <Button size='md' variant='text'>
                  Max
                </Button>
              </InputRightAddon>
            )}
          </InputGroup>
          {error ? (
            <Text fontSize='xs' color='red.500'>
              {error}
            </Text>
          ) : null}
          <Button
            px='2.5rem'
            mb={5}
            textTransform='uppercase'
            onClick={handleSubmit}
          >
            {submitBtn?.label}
          </Button>
        </>
      )}
    </ContentBox>
  );
};

export default StakeCard;
