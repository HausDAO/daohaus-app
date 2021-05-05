import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  Stack,
  Flex,
  Input,
  Icon,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from '@chakra-ui/react';
import {
  RiAddFill,
  RiErrorWarningLine,
  RiInformationLine,
} from 'react-icons/ri';

import { useParams } from 'react-router-dom';
import TextBox from '../components/TextBox';

import PaymentInput from './paymentInput';
import TributeInput from './tributeInput';
import AddressInput from './addressInput';
import DetailsFields from './detailFields';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import {
  createHash,
  detailsToJSON,
  daoConnectedAndSameChain,
} from '../utils/general';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDao } from '../contexts/DaoContext';
import { valToDecimalString } from '../utils/tokenValue';
import { chainByID } from '../utils/chain';
import { useMetaData } from '../contexts/MetaDataContext';
import { createForumTopic } from '../utils/discourse';

const FundingProposalForm = () => {
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
  const { daoMetaData } = useMetaData();
  const { daoid, daochain } = useParams();

  const [loading, setLoading] = useState(false);
  const [showShares, setShowShares] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showTribute, setShowTribute] = useState(false);
  const [currentError, setCurrentError] = useState(null);

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

  const onSubmit = async values => {
    setLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();

    console.log('values', values);
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
      : values?.memberApplicant
      ? values.memberApplicant
      : address;

    const args = [
      applicant,
      values.sharesRequested || '0',
      values.lootRequested || '0',
      tributeOffered,
      tributeToken,
      paymentRequested,
      paymentToken,
      details,
    ];

    try {
      const poll = createPoll({ action: 'submitProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
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
              title: 'Funding Proposal Submitted to the Dao!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: 'Funding Proposal',
              values,
              applicant,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: 'There was an error.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex justify='space-between' wrap='wrap'>
        <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
          <DetailsFields register={register} />
        </Box>
        <Box as={Stack} w={['100%', null, '50%']} spacing={5}>
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
            <Box>
              <Tooltip
                hasArrow
                shouldWrapChildren
                label='Shares provide voting power and exposure to assets. Only whole numbers accepted here, no decimals plz'
                placement='top'
              >
                <TextBox
                  as={FormLabel}
                  size='xs'
                  htmlFor='name'
                  mb={2}
                  d='flex'
                  alignItems='center'
                >
                  Shares Requested
                  <Icon as={RiInformationLine} ml={5} />
                </TextBox>
              </Tooltip>
              <Input
                name='sharesRequested'
                placeholder='0'
                defaultValue='0'
                ref={register({
                  required: {
                    value: true,
                    message:
                      'Requested shares are required. Set to zero for no shares.',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Requested shares must be a whole number',
                  },
                })}
              />
            </Box>
          )}
          {showLoot && (
            <Box>
              <Tooltip
                hasArrow
                shouldWrapChildren
                label='Loot provides exposure to assets but no voting power. Only whole numbers accepted here, no decimals plz'
                placement='top'
              >
                <TextBox
                  as={FormLabel}
                  size='xs'
                  htmlFor='lootRequested'
                  mb={2}
                  d='flex'
                  alignItems='center'
                >
                  Loot Requested
                </TextBox>
              </Tooltip>
              <Input
                name='lootRequested'
                placeholder='0'
                ref={register({
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Loot must be a whole number',
                  },
                })}
              />
            </Box>
          )}
          {showTribute && (
            <TributeInput
              register={register}
              setValue={setValue}
              getValues={getValues}
              setError={setError}
            />
          )}
          {(!showShares || !showLoot || !showTribute) && (
            <Box>
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
            </Box>
          )}
        </Box>
      </Flex>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='red.500' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
            {currentError.message}
          </Box>
        )}
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
              {`Connect
              ${
                injectedChain && daochain !== injectedChain?.chainId
                  ? `to ${chainByID(daochain).name}`
                  : 'Wallet'
              }`}
            </Button>
          )}
        </Box>
      </Flex>
    </form>
  );
};

export default FundingProposalForm;
