import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Stack,
  Box,
  Textarea,
  Select,
  Text,
  Switch,
  Spinner,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiOutlineCaretDown } from 'react-icons/ai';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';
import TextBox from '../components/TextBox';
import { MinionService } from '../services/minionService';
import { createPoll } from '../services/pollService';
import { chainByID } from '../utils/chain';
import { detailsToJSON, daoConnectedAndSameChain } from '../utils/general';
import { useMetaData } from '../contexts/MetaDataContext';
import { createForumTopic } from '../utils/discourse';
import { MINION_TYPES } from '../utils/proposalUtils';
import PaymentInput from './paymentInput';

const MinionProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [abiLoading, setAbiLoading] = useState(false);
  const { daoOverview } = useDao();
  const { daoMetaData } = useMetaData();
  const { daochain, daoid } = useParams();
  const {
    address,
    injectedProvider,
    requestWallet,
    injectedChain,
  } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const [currentError, setCurrentError] = useState(null);
  const [abiFunctions, setAbiFunctions] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [abiParams, setAbiParams] = useState(null);
  const [hexSwitch, setHexSwitch] = useState(null);
  const [minions, setMinions] = useState([]);
  const [selectedMinion, setSelectedMinion] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  const { handleSubmit, errors, register, setValue, getValues } = useForm();

  useEffect(() => {
    if (daoOverview?.minions) {
      console.log('local minions', daoOverview?.minions);
      const localMinions = daoOverview.minions
        .filter(
          minion =>
            minion.minionType === MINION_TYPES.VANILLA ||
            minion.minionType === MINION_TYPES.NIFTY,
        )
        .map(minion => ({
          minionAddress: minion.minionAddress,
          minionName: minion.details,
          minionType: minion.minionType,
        }));
      setMinions(localMinions);
    }
  }, [daoOverview?.minions]);

  useEffect(() => {
    const errArray = Object.keys(errors);
    if (errArray.length > 0) {
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
    const minion = minions.find(
      minion =>
        minion.minionAddress.toLowerCase() ===
        values.minionContract.toLowerCase(),
    );

    const minionName = minion?.minionName;
    const valueWei = injectedProvider.utils.toWei(values.value);

    const inputValues = [];
    let hexData;
    if (selectedFunction) {
      Object.keys(values).forEach(param => {
        if (param.indexOf('xparam') > -1) {
          console.log(param);
          try {
            inputValues.push(JSON.parse(values[param]));
          } catch {
            inputValues.push(values[param]);
          }
        }
      });

      const aSelectedFunction = abiFunctions.find(func => {
        return func.name === selectedFunction;
      });
      console.log('aSelectedFunction', aSelectedFunction);
      try {
        hexData = injectedProvider.eth.abi.encodeFunctionCall(
          aSelectedFunction,
          inputValues,
        );
        console.log('hexData', hexData);
      } catch (err) {
        console.log('ERR', err);
        setLoading(false);
        return;
      }
    }
    const details = detailsToJSON({
      title: minionName || `Minion proposal`,
      description: values.description,
    });
    let args;
    if (minion.minionType === MINION_TYPES.NIFTY) {
      args = [
        values.targetContract,
        valueWei || '0',
        values.dataValue || hexData,
        details,
        values.paymentToken,
        injectedProvider.utils.toWei(values.paymentRequested),
      ];
    } else {
      args = [
        values.targetContract,
        valueWei || '0',
        values.dataValue || hexData,
        details,
      ];
    }

    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: values.minionContract,
        createdAt: now,
        chainID: daochain,
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
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: 'Minion Proposal',
              values,
              applicant: address,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion: values.minionContract,
        chainID: daochain,
        minionType:
          minion.minionType === MINION_TYPES.NIFTY ? 'niftyMinion' : null,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  const selectFunction = e => {
    const { value } = e.target;

    const funcPrams = abiFunctions.find(func => +func.id === +value);
    setAbiParams(funcPrams.inputs);
    setSelectedFunction(funcPrams.name);
  };

  const getFunctions = abiParam => {
    let abi;

    if (typeof abiParam === 'object') {
      abi = abiParam;
    } else {
      try {
        abi = JSON.parse(abiParam);
      } catch (e) {
        // let validation handle errors
        return [];
      }
    }
    if (!abi) {
      return [];
    }
    const localAbiFunctions = abi
      .filter(({ type, constant }) => type === 'function' && !constant)
      .map((f, id) => ({ ...f, text: f.name, id }));

    return localAbiFunctions;
  };

  const handleBlur = async e => {
    const { value } = e.target;
    setAbiLoading(true);
    try {
      const key =
        daochain === '0x64' ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
      const url = `${chainByID(daochain).abi_api_url}${value}${key &&
        `&apikey=${key}`}`;
      const response = await fetch(url);
      const json = await response.json();

      if (!json.result || json.status === '0') {
        const msg = daochain === '0x64' ? json.message : json.result;
        throw new Error(msg);
      }
      const localAbiFunctions = getFunctions(JSON.parse(json.result));
      setCurrentError(null);
      setAbiParams(null);
      setAbiFunctions(localAbiFunctions);
      setAbiLoading(false);
    } catch (err) {
      setAbiParams(null);
      setAbiFunctions(null);
      setAbiLoading(false);
      setCurrentError(err);
      console.log(err);
    }
  };

  const toggleSwitch = () => {
    setHexSwitch(!hexSwitch);
    setAbiParams(null);
    setSelectedFunction(null);
  };

  const handleMinionChange = event => {
    const { value } = event.target;
    console.log('daoOverview.minions', daoOverview.minions);
    console.log('value', value);
    const minion = daoOverview.minions.find(m => m.minionAddress === value);
    console.log('selectedminion', minion);
    setSelectedMinion(minion);
  };

  return minions?.length ? (
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
          <TextBox as={FormLabel} size='xs' htmlFor='minionContract'>
            Minion Contract
          </TextBox>
          <Select
            name='minionContract'
            icon={<AiOutlineCaretDown />}
            mb={5}
            focusBorderColor='secondary.500'
            ref={register({
              required: {
                value: true,
                message: 'Minion contract is required',
              },
            })}
            placeholder='Select Minion'
            onChange={handleMinionChange}
          >
            {' '}
            {minions?.map(minion => (
              <option key={minion.minionAddress} value={minion.minionAddress}>
                {minion.minionName || minion.minionAddress}{' '}
                {minion.minionType === MINION_TYPES.NIFTY &&
                  '(BETA - battle testing)'}
              </option>
            ))}
          </Select>
          <TextBox as={FormLabel} size='xs' htmlFor='targetContract'>
            Target Contract
          </TextBox>
          <Input
            name='targetContract'
            placeholder='0x'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Target contract is required',
              },
            })}
            onBlur={handleBlur}
          />
          {selectedMinion?.minionType === 'nifty minion' && (
            <PaymentInput
              formLabel='Forward Funds'
              register={register}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
            />
          )}
          <TextBox as={FormLabel} size='xs' pt={3} htmlFor='value'>
            Value
          </TextBox>
          <Input
            name='value'
            default='0'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Value is required',
              },
            })}
          />
          <Stack spacing={4}>
            <Textarea
              name='description'
              placeholder='Short Description'
              mb={5}
              h={10}
              ref={register({
                required: {
                  value: true,
                  message: 'Description is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
          </Stack>
        </Box>
        <Box w={['100%', null, '50%']}>
          {hexSwitch ? (
            <>
              <TextBox as={FormLabel} size='xs' htmlFor='dataValue'>
                Data
              </TextBox>
              <Textarea
                name='dataValue'
                placeholder='Raw Hex Data'
                mb={5}
                rows={13}
                ref={register({
                  required: {
                    value: true,
                    message: 'Data hex value is required',
                  },
                })}
              />
            </>
          ) : (
            <>
              <TextBox as={FormLabel} size='xs' htmlFor='abiFunctions'>
                <Box mr={2}>ABI Functions</Box>
                {abiLoading && <Spinner />}
              </TextBox>
              <Select
                name='abiFunctions'
                placeholder='Select function'
                icon={<AiOutlineCaretDown />}
                disabled={!abiFunctions}
                ref={register}
                onChange={selectFunction}
              >
                {abiFunctions &&
                  abiFunctions.map(funct => {
                    return (
                      <option key={funct.id} value={funct.id}>
                        {funct.name}
                      </option>
                    );
                  })}
              </Select>
              {abiParams && (
                <>
                  <FormLabel
                    htmlFor='abiParams'
                    color='white'
                    fontFamily='heading'
                    textTransform='uppercase'
                    fontSize='sm'
                    fontWeight={700}
                    mt={4}
                  >
                    ABI Params
                  </FormLabel>
                  <Stack spacing={3}>
                    {abiParams &&
                      abiParams.map((param, idx) => {
                        return (
                          <Stack key={idx} spacing={1}>
                            <TextBox size='xs'>{param.name}</TextBox>
                            <Input
                              name={`xparam${param.name}`}
                              ref={register}
                              placeholder={param.type}
                            />
                          </Stack>
                        );
                      })}
                  </Stack>
                </>
              )}
            </>
          )}
        </Box>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='hexSwitch' mb='0'>
          Raw hex
        </FormLabel>
        <Switch id='hexSwitch' onChange={toggleSwitch} />
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='secondary.300' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
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
              Submit{' '}
              {selectedMinion?.minionType === 'nifty minion' && '*Nifty Minion'}
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
  ) : (
    <>
      <Text>You do not have a minion yet</Text>
      <Text>In beta add a free Minion Boost for your DAO here</Text>
    </>
  );
};

export default MinionProposalForm;
