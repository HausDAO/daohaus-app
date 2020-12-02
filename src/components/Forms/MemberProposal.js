import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { utils } from 'web3';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';

import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';
import TextBox from '../Shared/TextBox';

import PaymentInput from './PaymentInput';
import TributeInput from './TributeInput';
import AddressInput from './AddressInput';
import DetailsFields from './DetailFields';

const MemberProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showPaymentRequest, setShowPaymentRequest] = useState(false);
  const [showApplicant, setShowApplicant] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    getValues,
    watch,
    // formState
  } = useForm();

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

  // TODO check tribute token < currentWallet.token.balance & unlock
  // TODO check link is a valid link

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details);
      txProcessor.forceUpdate = true;

      updateTxProcessor({ ...txProcessor });
      // close model here
      // onClose();
      // setShowModal(null);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log(values);

    const details = JSON.stringify({
      title: values.title,
      description: values.description,
      link: 'https://' + values.link,
      hash: Math.random(0, 10000),
    });

    try {
      dao.daoService.moloch.submitProposal(
        values.sharesRequested ? values.sharesRequested?.toString() : '0',
        values.lootRequested ? values.lootRequested?.toString() : '0',
        values.tributeOffered
          ? utils.toWei(values.tributeOffered?.toString())
          : '0',
        values.tributeToken,
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken || values.tributeToken,
        details,
        values.applicant || user.username,
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
      >
        <Box w='48%'>
          <DetailsFields register={register} />
        </Box>
        <Box w='48%'>
          <TextBox as={FormLabel} htmlFor='name' mb={2}>
            Shares Requested
          </TextBox>
          <Input
            name='sharesRequested'
            placeholder='0'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Requested shares are required for Member Proposals',
              },
              pattern: {
                value: /[0-9]/,
                message: 'Requested shares must be a number',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
          <TributeInput
            register={register}
            setValue={setValue}
            getValues={getValues}
          />
          {showLoot && (
            <>
              <TextBox as={FormLabel} htmlFor='lootRequested' mb={2}>
                Loot Requested
              </TextBox>
              <Input
                name='lootRequested'
                placeholder='0'
                mb={5}
                ref={register({
                  pattern: {
                    value: /[0-9]/,
                    message: 'Loot must be a number',
                  },
                })}
                color='white'
                focusBorderColor='secondary.500'
              />
            </>
          )}
          {showPaymentRequest && (
            <PaymentInput
              name='paymentRequested'
              register={register}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
            />
          )}
          {showApplicant && (
            <AddressInput
              name='applicant'
              register={register}
              setValue={setValue}
              watch={watch}
            />
          )}
          {(!showApplicant || !showLoot || !showPaymentRequest) && (
            <Menu color='white' textTransform='uppercase'>
              <MenuButton
                as={Button}
                variant='outline'
                rightIcon={<Icon as={RiAddFill} />}
              >
                Additional Options
              </MenuButton>
              <MenuList>
                {!showApplicant && (
                  <MenuItem onClick={() => setShowApplicant(true)}>
                    Applicant
                  </MenuItem>
                )}
                {!showLoot && (
                  <MenuItem onClick={() => setShowLoot(true)}>
                    Request Loot
                  </MenuItem>
                )}
                {!showPaymentRequest && (
                  <MenuItem onClick={() => setShowPaymentRequest(true)}>
                    Request Payment
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
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

export default MemberProposalForm;
