import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { UBERHAUS_ADDRESS } from '../utils/uberhaus';

import { useOverlay } from '../contexts/OverlayContext';
// import { createHash, detailsToJSON } from '../utils/general';
import RageInput from './rageInput';
// import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { useDao } from '../contexts/DaoContext';
import { MolochService } from '../services/molochService';

const RageQuitProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const { setD2dProposalModal } = useOverlay();
  const { daoOverview } = useDao();

  const { handleSubmit, errors, register, setValue } = useForm();

  const currentMinion = useMemo(() => {
    return daoOverview.minions.find(
      (minion) =>
        minion.minionType === 'UberHaus minion' &&
        minion.uberHausAddress === UBERHAUS_ADDRESS,
    );
  }, [daoOverview]);

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

  useEffect(() => {
    MolochService();
  }, [currentMinion]);

  const onSubmit = async (values) => {
    setLoading(true);

    // const hash = createHash();
    // const now = (new Date().getTime() / 1000).toFixed();

    // const details = detailsToJSON({
    //   values,
    //   uberHaus: true,
    //   uberType: PROPOSAL_TYPES.MINION_UBER_RQ,
    //   hash,
    // });

    // const hash = createHash();
    // const details = detailsToJSON({
    //   ...values,
    //   uberHaus: true,
    //   uberType: 'staking',
    //   hash,
    // });

    // const tributeOffered = values.tributeOffered
    //   ? valToDecimalString(
    //       values.tributeOffered,
    //       UBERHAUS_STAKING_TOKEN.toLowerCase(),
    //       daoOverview.tokenBalances,
    //     )
    //   : '0';

    // const submitProposalArgs = [
    //   uberHausMinionData.minionAddress,
    //   values.sharesRequested || '0',
    //   '0',
    //   tributeOffered,
    //   UBERHAUS_STAKING_TOKEN,
    //   '0',
    //   daoOverview.depositToken.tokenAddress,
    //   details,
    // ];

    // const submitProposalAbiData = molochAbi.find(
    //   (f) => f.type === 'function' && f.name === 'submitProposal',
    // );

    // const hexData = injectedProvider.eth.abi.encodeFunctionCall(
    //   submitProposalAbiData,
    //   submitProposalArgs,
    // );

    // const args = [
    //   daoid,
    //   UBERHAUS_ADDRESS,
    //   UBERHAUS_STAKING_TOKEN,
    //   '0',
    //   hexData,
    //   details,
    // ];

    // console.log('args', args);

    // try {
    //   const poll = createPoll({ action: 'uberHausProposeAction', cachePoll })({
    //     minionAddress: uberHausMinionData.minionAddress,
    //     createdAt: now,
    //     chainID: daochain,
    //     hash,
    //     actions: {
    //       onError: (error, txHash) => {
    //         errorToast({
    //           title: `There was an error.`,
    //         });
    //         resolvePoll(txHash);
    //         console.error(`Could not find a matching proposal: ${error}`);
    //       },
    //       onSuccess: (txHash) => {
    //         successToast({
    //           title: 'UberHAUS Membership Proposal Submitted to the DAO!',
    //         });
    //         refreshDao();
    //         resolvePoll(txHash);
    //         createForumTopic({
    //           chainID: daochain,
    //           daoID: daoid,
    //           afterTime: now,
    //           proposalType: 'UberHAUS Membership Proposal',
    //           values,
    //           daoid,
    //           daoMetaData,
    //         });
    //       },
    //     },
    //   });
    //   const onTxHash = () => {
    //     setD2dProposalModal((prevState) => !prevState);
    //     setTxInfoModal(true);
    //   };
    //   await UberHausMinionService({
    //     web3: injectedProvider,
    //     uberHausMinion: uberHausMinionData.minionAddress,
    //     chainID: daochain,
    //   })('proposeAction')({ args, address, poll, onTxHash });
    // } catch (err) {
    //   setLoading(false);
    //   setD2dProposalModal((prevState) => !prevState);
    //   console.error('error: ', err);
    //   errorToast({
    //     title: `There was an error.`,
    //   });
    // }
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

  // const handleChange = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        mt={6}
        flexWrap='wrap'
      >
        <Box w='100%' pr={[0, null, 5]}>
          {/* <RageInput
            register={register}
            setValue={setValue}
            label='Shares to Rage Quit'
            type='shares'
            max='10'
          /> */}
          <RageInput
            register={register}
            setValue={setValue}
            label='Shares to Rage'
            type='shares'
            max={10}
            mb={6}
          />
          <RageInput
            register={register}
            setValue={setValue}
            label='Loot to Rage'
            type='loot'
            max={10}
          />

          {/* <Flex justify='center' my={3}>
            <TextBox size='xs'>Equals</TextBox>
          </Flex> */}
          {/* <TextBox size='xs' htmlFor='hausToReceive' mb={2} mt={6}>
            Loot to Rage Quit
          </TextBox>
          <Input
            name='hausToReceive'
            placeholder='0'
            value={10}
            onChange={handleChange}
            color='white'
            focusBorderColor='secondary.500'
          /> */}
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

        {/* <Box w={['100%', null, '50%']} p={3}>
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
        </Box> */}
      </FormControl>
    </form>
  );
};

export default RageQuitProposalForm;
