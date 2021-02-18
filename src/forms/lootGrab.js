import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Flex,
  Icon,
  Box,
  Link,
  Tooltip,
  VisuallyHidden,
} from '@chakra-ui/react';
import { RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';

import TextBox from '../components/TextBox';

import TributeInput from './tributeInput';
import DetailsFields from './detailFields';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import {
  createHash,
  daoConnectedAndSameChain,
  detailsToJSON,
} from '../utils/general';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDao } from '../contexts/DaoContext';
import { valToDecimalString } from '../utils/tokenValue';
import { chainByID } from '../utils/chain';
import { useMetaData } from '../contexts/MetaDataContext';
import { createForumTopic } from '../utils/discourse';

const LootGrabForm = () => {
  const {
    injectedProvider,
    address,
    requestWallet,
    injectedChain,
  } = useInjectedProvider();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();
  const { daoMetaData } = useMetaData();

  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [editDetails, setEditDetails] = useState();

  const ratio = 1;

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    setError,
    getValues,
    watch,
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

  const onSubmit = async (values) => {
    console.log(values);

    setLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();
    const details = detailsToJSON({ ...values, hash });
    const { tokenBalances, depositToken } = daoOverview;
    const tributeToken = values.tributeToken || depositToken.tokenAddress;
    const paymentToken = values.paymentToken || depositToken.tokenAddress;
    const tributeOffered = values.tributeOffered
      ? valToDecimalString(values.tributeOffered, tributeToken, tokenBalances)
      : '0';
    const paymentRequested = values.paymentRequested
      ? valToDecimalString(values.paymentRequested, paymentToken, tokenBalances)
      : '0';
    const applicant = values?.applicantHidden?.startsWith('0x')
      ? values.applicantHidden
      : values?.applicant
      ? values.applicant
      : address;
    const args = [
      applicant,
      values.sharesRequested || '0',
      Math.floor(values.tributeOffered * ratio || '0').toString(),
      tributeOffered,
      tributeToken,
      paymentRequested,
      paymentToken,
      details,
    ];
    console.log(args);
    try {
      const poll = createPoll({ action: 'submitProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Loot Grab Proposal Submitted to the Dao!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: 'Loot Grab',
              values,
              applicant,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setTxInfoModal(true);
        setProposalModal(false);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitProposal')({ args, address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: `There was an error.`,
        description: err?.message || '',
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
        flexWrap='wrap'
      >
        {editDetails ? (
          <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
            <DetailsFields register={register} defaultTitle={'Loot Grab'} />
          </Box>
        ) : (
          <VisuallyHidden>
            <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
              <DetailsFields register={register} defaultTitle={'Loot Grab'} />
            </Box>
          </VisuallyHidden>
        )}
        <Box w={['100%', null, '50%']}>
          <TributeInput
            register={register}
            setValue={setValue}
            getValues={getValues}
            setError={setError}
          />
          <Tooltip
            label='Amount of Loot you can request is calculated based on the amount of tribute'
            hasArrow
            placement='top'
            shouldWrapChildren
          >
            <TextBox size='xs' d='flex' alignItems='center'>
              Loot Requested <RiInformationLine style={{ marginLeft: 5 }} />
            </TextBox>
          </Tooltip>
          <TextBox variant='value'>
            {Math.floor(watch('tributeOffered') * ratio || 0).toString()}
          </TextBox>
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='red.500' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
            {currentError.message}
          </Box>
        )}

        <Box p='4'>
          {!editDetails && (
            <Link onClick={() => setEditDetails(true)}>Edit Details</Link>
          )}
        </Box>

        <Box>
          {daoConnectedAndSameChain(
            address,
            daochain,
            injectedChain?.chainId,
          ) ? (
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={requestWallet}
              isDisabled={injectedChain && daochain !== injectedChain?.chainId}
            >
              Connect
              {injectedChain && daochain !== injectedChain?.chainId
                ? `to ${chainByID(daochain).name}`
                : 'Wallet'}
            </Button>
          )}
        </Box>
      </Flex>
    </form>
  );
};

export default LootGrabForm;
