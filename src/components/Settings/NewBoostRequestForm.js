import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Textarea,
  Button,
  Input,
  ButtonGroup,
  Flex,
  CheckboxGroup,
  Checkbox,
  HStack,
} from '@chakra-ui/core';
import { useDao } from '../../contexts/PokemolContext';
// import ComingSoonOverlay from '../Shared/ComingSoonOverlay';

const NewBoostRequestForm = () => {
  const [dao] = useDao();
  const { handleSubmit, register, formState } = useForm();
  const [comments, setComments] = useState(false);
  const onSubmit = (data) => console.log(data);

  const { touched } = formState;

  return (
    <Box
      w='100%'
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
    >
      <Box fontFamily='heading' fontSize='3xl' fontWeight={700}>
        We&apos;re powering up your community!
      </Box>
      <Box
        maxW='70%'
        fontFamily='heading'
        fontSize='lg'
        fontWeight={700}
        my={6}
      >
        Tell us about the application or feature we can add to best help your
        community.
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Input
            name='idea'
            placeholder='Sell NFT on OpenSea'
            w='60%'
            ref={register}
          />
          <Box fontFamily='heading' fontSize='md' fontWeight={700} my={6}>
            What types of things would you like to do with your community?
          </Box>

          <CheckboxGroup>
            <HStack spacing={10} direction='row'>
              <Checkbox name='poolLiquidity' ref={register}>
                Pool Liquidity in DeFi
              </Checkbox>
              <Checkbox name='manageCollection' ref={register}>
                Manage a collection of collectibles
              </Checkbox>
            </HStack>
            <HStack spacing={10} direction='row'>
              <Checkbox name='saveInvest' ref={register}>
                Save & Invest
              </Checkbox>
              <Checkbox name='achievements' ref={register}>
                Recognize Achievements of Community Members
              </Checkbox>
            </HStack>
          </CheckboxGroup>
        </Box>
        {comments && (
          <Box>
            <Box fontFamily='heading' fontSize='md' fontWeight={700} my={6}>
              What else would you like to share?
            </Box>
            <Textarea
              name='boostComments'
              placeholder='Dearly beloved, we are gathered here to remember Moloch who has joined the Speghetti Monster in the sky.'
            />
          </Box>
        )}
        <Flex justify='flex-end'>
          <ButtonGroup my={6}>
            {Object.keys(touched).length > 0 ? (
              <Button variant='outline' onClick={() => setComments(true)}>
                Comments
              </Button>
            ) : (
              <Button as={Link} variant='outline' to={`/dao/${dao.address}`}>
                I don&apos;t have anything to share right now
              </Button>
            )}

            <Button fontWeight={700} type='submit'>
              Submit
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </Box>
  );
};

export default NewBoostRequestForm;
