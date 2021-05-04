import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { UBERHAUS_DATA } from '../utils/uberhaus';
import molochAbi from '../contracts/molochV2.json';
import { useOverlay } from '../contexts/OverlayContext';
import RageInput from './rageInput';
import { createHash, detailsToJSON } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createForumTopic } from '../utils/discourse';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { useMetaData } from '../contexts/MetaDataContext';
import { UberHausMinionService } from '../services/uberHausMinionService';

const RageQuitProposalForm = ({ uberHausMinion, uberMembers }) => {
  const {
    setD2dProposalModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();

  const { injectedProvider, address } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid } = useParams();
  const { refreshDao } = useTX();

  const { handleSubmit, errors, register, setValue } = useForm();
  const { daoMetaData } = useMetaData();

  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [minionLoot, setMinionLoot] = useState(0);
  const [minionShares, setMinionShares] = useState(0);

  useEffect(() => {
    if (!uberHausMinion && !uberMembers) return;
    const uberMinionMember = uberMembers.find(
      member => member.memberAddress === uberHausMinion.minionAddress,
    );

    if (+uberMinionMember.shares) {
      console.log(+uberMinionMember.shares);
      setMinionShares(+uberMinionMember.shares);
    }
    if (+uberMinionMember.loot) {
      console.log(+uberMinionMember.loot);
      setMinionLoot(+uberMinionMember.loot);
    }
  }, [uberHausMinion, uberMembers]);

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

  const onSubmit = async values => {
    setLoading(true);
    console.log('formValues', values);

    const hash = createHash();
    const now = (new Date().getTime() / 1000).toFixed();
    const description = `This is a proposal to Rage Quit ${values.shares ||
      '0'} Shares and ${values.loot || '0'} from UberHAUS`;
    const details = detailsToJSON({
      values,
      uberHaus: true,
      uberType: 'ragequit',
      hash,
      title: 'Rage Quit Assets from UberHAUS',
      description,
    });

    const RQargs = [
      values.shares?.toString() || '0',
      values.loot?.toString() || '0',
    ];
    const submitRQAbiData = molochAbi.find(
      f => f.type === 'function' && f.name === 'ragequit',
    );

    const hexData = injectedProvider.eth.abi.encodeFunctionCall(
      submitRQAbiData,
      RQargs,
    );

    const args = [
      daoid,
      UBERHAUS_DATA.ADDRESS,
      UBERHAUS_DATA.STAKING_TOKEN,
      '0',
      hexData,
      details,
    ];

    try {
      const poll = createPoll({ action: 'uberHausProposeAction', cachePoll })({
        minionAddress: uberHausMinion.minionAddress,
        createdAt: now,
        chainID: UBERHAUS_DATA.NETWORK,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Rage Quit proposal Submitted to the DAO!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: UBERHAUS_DATA.NETWORK,
              daoID: daoid,
              afterTime: now,
              proposalType: PROPOSAL_TYPES.MINION_UBER_RQ,
              values,
              daoid,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setD2dProposalModal(prevState => !prevState);
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: uberHausMinion.minionAddress,
        chainID: UBERHAUS_DATA.NETWORK,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setD2dProposalModal(prevState => !prevState);
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: 'There was an error.',
        description: err.message || '',
      });
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
        mt={6}
        flexWrap='wrap'
      >
        <Box w='100%' pr={[0, null, 5]}>
          <RageInput
            register={register}
            setValue={setValue}
            label='Shares to Rage'
            type='shares'
            max={minionShares}
            mb={6}
          />
          <RageInput
            register={register}
            setValue={setValue}
            label='Loot to Rage'
            type='loot'
            max={minionLoot}
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
