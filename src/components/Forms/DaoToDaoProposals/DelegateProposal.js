import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Image,
  Box,
} from '@chakra-ui/react';
import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';
import DAOHaus from '../../../assets/Daohaus__Castle--Dark.svg';

import {
  useDao,
  useTxProcessor,
  useUser,
  useModals,
} from '../../../contexts/PokemolContext';
import TextBox from '../../Shared/TextBox';
import DetailsFields from '../Shared/DetailFields';
import AddressInput from '../Shared/AddressInput';
import { detailsToJSON } from '../../../utils/proposal-helper';
import DelegateMenu from '../../Shared/DelegateMenu';

// TODO pass delegate to delegate menu
// TODO replace delegate with user avatar
// TODO sort out term limits, emergency recall

const StakeProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const { closeModals } = useModals();

  const { handleSubmit, errors, register, setValue, watch } = useForm();

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

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details);
      txProcessor.forceUpdate = true;

      updateTxProcessor({ ...txProcessor });
      // close model here
      closeModals();
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    const details = detailsToJSON(values);
    try {
      dao.daoService.moloch.submitProposal(
        values.sharesRequested ? values.sharesRequested?.toString() : '0',
        values.lootRequested ? values.lootRequested?.toString() : '0',
        values.tributeOffered
          ? utils.toWei(values.tributeOffered?.toString())
          : '0',
        values.tributeToken || dao.graphData.depositToken.tokenAddress,
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken || dao.graphData.depositToken.tokenAddress,
        details,
        values?.applicantHidden?.startsWith('0x')
          ? values.applicantHidden
          : values?.applicant
          ? values.applicant
          : user.username,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

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
          <DetailsFields register={register} />
        </Box>
        <Box w={['100%', null, '50%']}>
          <TextBox size='xs' htmlFor='name' mb={2}>
            Current Delegate
          </TextBox>
          <Flex w='60%' align='center' justify='space-between' pb={3}>
            <Image src={DAOHaus} w='40px' h='40px' />
            <Box fontFamily='heading' fontWeight={900}>
              takashi.eth
            </Box>
            <DelegateMenu />
          </Flex>

          <AddressInput
            name='delegate'
            formLabel='Delegate Address'
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <TextBox as={FormLabel} size='xs' htmlFor='name' mb={2}>
            Term
          </TextBox>
          <Input
            name='delegateTerm'
            placeholder='0'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Delegate term is required for Delegate Proposals',
              },
              pattern: {
                value: /[0-9]/,
                message: 'Term must be a number in months',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='secondary.300' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
            {currentError.message}
          </Box>
        )}
        <Box>
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export default StakeProposalForm;
