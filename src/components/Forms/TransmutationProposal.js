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
import TextBox from '../Shared/TextBox';
import { utils } from 'web3';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';

import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';

import TributeInput from './TributeInput';
import PaymentInput from './PaymentInput';
import AddressInput from './AddressInput';
import DetailsFields from './DetailFields';
import { detailsToJSON } from '../../utils/proposal-helper';
import GraphFetch from '../Shared/GraphFetch';
import { GET_TRANSMUTATION } from '../../utils/boost-queries';

const TransmutationProposal = () => {
  const [loading, setLoading] = useState(false);
  const [showShares, setShowShares] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showTribute, setShowTribute] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);

  const [transmutationData, setTransmutationData] = useState();

  console.log('tansmutationData', transmutationData);
  console.log('dao', dao);

  const {
    handleSubmit,
    errors,
    register,
    reset,
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

  // const txCallBack = (txHash, details) => {
  //   console.log('txCallBack', txProcessor);
  //   if (txProcessor && txHash) {
  //     txProcessor.setTx(txHash, user.username, details);
  //     txProcessor.forceUpdate = true;

  //     updateTxProcessor({ ...txProcessor });
  //     // close model here
  //     // onClose();
  //     // setShowModal(null);
  //     setLoading(false);
  //     reset();
  //   }
  //   if (!txHash) {
  //     console.log('error: ', details);
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log('values', values);

    // const details = detailsToJSON(values);

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
    //       : values?.memberApplicant,
    //     txCallBack,
    //   );
    // } catch (err) {
    //   setLoading(false);
    //   console.log('error: ', err);
    // }
  };

  return (
    <>
      {transmutationData ? (
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
              <AddressInput
                name='applicant'
                register={register}
                setValue={setValue}
                watch={watch}
              />
              <PaymentInput
                register={register}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
              />

              {showShares && (
                <>
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
                        message:
                          'Requested shares are required for Member Proposals',
                      },
                      pattern: {
                        value: /[0-9]/,
                        message: 'Requested shares must be a number',
                      },
                    })}
                  />
                </>
              )}
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
                  />
                </>
              )}
              {showTribute && (
                <TributeInput
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
              {(!showShares || !showLoot || !showTribute) && (
                <Menu textTransform='uppercase'>
                  <MenuButton
                    as={Button}
                    variant='outline'
                    rightIcon={<Icon as={RiAddFill} />}
                  >
                    Additional Options
                  </MenuButton>
                  <MenuList>
                    {!showShares && (
                      <MenuItem onClick={() => setShowShares(true)}>
                        Request Shares
                      </MenuItem>
                    )}
                    {!showLoot && (
                      <MenuItem onClick={() => setShowLoot(true)}>
                        Request Loot
                      </MenuItem>
                    )}
                    {!showTribute && (
                      <MenuItem onClick={() => setShowTribute(true)}>
                        Give Tribute
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </Box>
          </FormControl>
          <Flex justify='flex-end' align='center' h='60px'>
            {currentError && (
              <Box color='red.500' fontSize='m' mr={5}>
                <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
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
      ) : (
        <GraphFetch
          query={GET_TRANSMUTATION}
          setRecords={setTransmutationData}
          entity='transmutations'
          isBoosts={true}
          variables={{ contractAddress: dao.address }}
        />
      )}
    </>
  );
};

export default TransmutationProposal;
