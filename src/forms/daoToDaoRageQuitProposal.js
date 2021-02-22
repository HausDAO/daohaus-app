import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Input, Icon, Box } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useOverlay } from '../contexts/OverlayContext';
import TextBox from '../components/TextBox';
import { detailsToJSON } from '../utils/general';
import RageInput from './rageInput';

const RageQuitProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const { setD2dProposalModal } = useOverlay();

  const { handleSubmit, errors, register, setValue } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = async (values) => {
    setLoading(true);

    const details = detailsToJSON(values);
    console.log(details);
    // try {
    //   dao.daoService.moloch.submitProposal(
    //     values.sharesRequested ? values.sharesRequested?.toString() : '0',
    //     values.lootRequested ? values.lootRequested?.toString() : '0',
    //     values.tributeOffered
    //       ? utils.toWei(values.tributeOffered?.toString())
    //       : '0',
    //     values.tributeToken || dao.graphData.depositToken.tokenAddress,
    //     values.paymentRequested
    //       ? utils.toWei(values.paymentRequested?.toString())
    //       : '0',
    //     values.paymentToken || dao.graphData.depositToken.tokenAddress,
    //     details,
    //     values?.applicantHidden?.startsWith('0x')
    //       ? values.applicantHidden
    //       : values?.applicant
    //       ? values.applicant
    //       : user.username,
    //     txCallBack,
    //   );
    // } catch (err) {
    //   setLoading(false);
    //   console.log('error: ', err);
    // }
    setD2dProposalModal((prevState) => !prevState);
  };

  const handleChange = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        flexWrap='wrap'
      >
        <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
          <RageInput
            register={register}
            setValue={setValue}
            label="Shares You'll RageQuit"
            type='shares'
            max='10'
          />
          <Flex justify='center' my={3}>
            <TextBox size='xs'>Equals</TextBox>
          </Flex>
          <TextBox size='xs' htmlFor='hausToReceive' mb={2}>
            HAUS You&apos;ll Receive
          </TextBox>
          <Input
            name='hausToReceive'
            placeholder='0'
            value={10}
            onChange={handleChange}
            color='white'
            focusBorderColor='secondary.500'
          />
          <Flex justify='center' mt={8}>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
            >
              Submit
            </Button>
            {currentError && (
              <Box color='secondary.300' fontSize='m' mt={4}>
                <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
                {currentError.message}
              </Box>
            )}
          </Flex>
        </Box>

        <Box w={['100%', null, '50%']} p={3}>
          <Box fontFamily='heading' fontSize='2xl' fontWeight={900} mb={3}>
            Important Info:
          </Box>
          <Box fontSize='sm'>
            Input the amount of shares you want to ragequit from this DAO. After
            you ragequit, come back to this page and confirm that you ragequit
            the number of shares you previously input here.
            <br />
            <br />
            Once you confirm, our minion will work some magic to pull your
            portion of this DAO’s $Haus and send it to your address.
          </Box>
          <Button variant='outline' mt={3}>
            Confirm RageQuit
          </Button>
        </Box>
      </FormControl>
    </form>
  );
};

export default RageQuitProposalForm;
