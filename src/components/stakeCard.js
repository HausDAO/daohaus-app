import React from 'react';
import {
  Box,
  Flex,
  Button,
  InputGroup,
  FormLabel,
  Input,
  InputRightAddon,
} from '@chakra-ui/react';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';

const StakeCard = (props) => {
  const {
    title,
    description,
    reward,
    inputLabel,
    inputMax,
    amtEarned,
    onSubmit,
    onHarvest,
    onWithdraw,
    submitBtn,
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
        />
        {inputMax && (
          <InputRightAddon background='primary.500' p={0}>
            <Button size='md' variant='text'>
              Max
            </Button>
          </InputRightAddon>
        )}
      </InputGroup>
      <Button
        px='2.5rem'
        mb={5}
        textTransform='uppercase'
        onClick={handleSubmit}
      >
        {submitBtn?.label}
      </Button>
      <Flex align='center' mb={3}>
        <TextBox size='xs' transform='translateY(2px)' mr={2}>
          Earned:
        </TextBox>
        <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
          {amtEarned}
        </Box>
      </Flex>
      <Flex>
        <Button
          size='sm'
          variant='outline'
          px='1.5rem'
          mr={4}
          onClick={onHarvest}
        >
          Harvest
        </Button>
        <Button size='sm' variant='outline' px='1.5rem' onClick={onWithdraw}>
          Withdraw All
        </Button>
      </Flex>
    </ContentBox>
  );
};

export default StakeCard;
