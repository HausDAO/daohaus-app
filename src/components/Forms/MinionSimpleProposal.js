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
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useModals,
  useNetwork,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { MinionService } from '../../utils/minion-service';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { supportedChains } from '../../utils/chains';

const MinionProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [abiLoading, setAbiLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();

  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const [abiFunctions, setAbiFunctions] = useState();
  const [selectedFunction, setSelectedFunction] = useState();
  const [abiParams, setAbiParams] = useState();
  const [hexSwitch, setHexSwitch] = useState();
  const [minions, setMinions] = useState([]);
  const { closeModals } = useModals();

  const {
    handleSubmit,
    errors,
    register,
    // formState
  } = useForm();

  useEffect(() => {
    if (dao?.graphData?.minions) {
      const _minions = dao.graphData.minions.map(
        (minion) => minion.minionAddress,
      );
      setMinions(_minions);
    }
    // eslint-disable-next-line
  }, [dao?.graphData?.minions]);

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
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

      updateTxProcessor(txProcessor);
      // close model here
      closeModals();
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    console.log('values', values);
    setLoading(true);

    console.log(values);
    const setupValues = {
      minion: values.minionContract,
      actionVlaue: '0',
    };
    const minionService = new MinionService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    const valueWei = web3Connect.web3.utils.toWei(values.value);

    const inputValues = [];
    let hexData;
    if (selectedFunction) {
      Object.keys(values).forEach((param) => {
        if (param.indexOf('xparam') > -1) {
          console.log(param);
          inputValues.push(JSON.parse(values[param]));
        }
      });
      console.log('inputs', inputValues);
      console.log('selectedFunction', selectedFunction);
      const aSelectedFunction = abiFunctions.find((func) => {
        return func.name === selectedFunction;
      });
      console.log('aSelectedFunction', aSelectedFunction);
      try {
        hexData = web3Connect.web3.eth.abi.encodeFunctionCall(
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

    try {
      minionService.propose(
        values.targetContract,
        valueWei || setupValues.actionVlaue,
        values.dataValue || hexData,
        values.description,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  const handleBlur = async (e) => {
    const { value } = e.target;
    setAbiLoading(true);
    try {
      const key =
        network.network_id === 100 ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
      const url = `${
        supportedChains[network.network_id].abi_api_url
      }${value}${key && '&apikey=' + key}`;
      const response = await fetch(url);
      const json = await response.json();

      if (!json.result || json.status === '0') {
        const msg = network.network_id === 100 ? json.message : json.result;
        throw new Error(msg);
      }
      const _abiFunctions = getFunctions(JSON.parse(json.result));
      setCurrentError(null);
      setAbiParams(null);
      setAbiFunctions(_abiFunctions);
      setAbiLoading(false);
    } catch (err) {
      setAbiParams(null);
      setAbiFunctions(null);
      setAbiLoading(false);
      setCurrentError(err);
      console.log(err);
    }
  };

  const selectFunction = (e) => {
    const { value } = e.target;
    console.log(value, abiFunctions);
    const funcPrams = abiFunctions.find((func) => +func.id === +value);
    setAbiParams(funcPrams.inputs);
    setSelectedFunction(funcPrams.name);
  };

  const getFunctions = (abiParam) => {
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
    const _abiFunctions = abi
      .filter(({ type, constant }) => type === 'function' && !constant)
      .map((f, id) => ({ ...f, text: f.name, id }));

    return _abiFunctions;
  };

  const toggleSwitch = () => {
    setHexSwitch(!hexSwitch);
    setAbiParams(null);
    setSelectedFunction(null);
  };

  return minions.length ? (
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
          <FormLabel
            htmlFor='minionContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Minion Contract
          </FormLabel>
          <Select
            name='minionContract'
            mb={5}
            focusBorderColor='secondary.500'
            ref={register({
              required: {
                value: true,
                message: 'Minion contract is required',
              },
            })}
            color='black'
            backgroundColor='white'
            placeholder='Select Minion'
            variant='flushed'
          >
            {' '}
            {minions.map((minion, idx) => (
              <option key={idx} value={minion}>
                {minion}
              </option>
            ))}
          </Select>
          <FormLabel
            htmlFor='targetContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Target Contract
          </FormLabel>
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
            color='white'
            focusBorderColor='secondary.500'
            onBlur={handleBlur}
          />
          <FormLabel
            htmlFor='value'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Value
          </FormLabel>
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
            color='white'
            focusBorderColor='secondary.500'
          />
          <Stack spacing={4}>
            <Textarea
              name='description'
              placeholder='Short Description'
              type='textarea'
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
              <FormLabel
                htmlFor='dataValue'
                color='white'
                fontFamily='heading'
                textTransform='uppercase'
                fontSize='xs'
                fontWeight={700}
              >
                Data
              </FormLabel>
              <Textarea
                name='dataValue'
                placeholder='Raw Hex Data'
                type='textarea'
                mb={5}
                rows={13}
                ref={register({
                  required: {
                    value: true,
                    message: 'Data hex value is required',
                  },
                })}
                color='white'
                focusBorderColor='secondary.500'
              />
            </>
          ) : (
            <>
              <FormLabel
                htmlFor='abiFunctions'
                color='white'
                fontFamily='heading'
                textTransform='uppercase'
                fontSize='xs'
                fontWeight={700}
              >
                ABI Functions {abiLoading && <Spinner />}
              </FormLabel>
              <Select
                name='abiFunctions'
                placeholder='Select function'
                icon={<AiOutlineCaretDown />}
                disabled={!abiFunctions}
                ref={register}
                onChange={selectFunction}
              >
                {abiFunctions &&
                  abiFunctions.map((funct) => {
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
                    fontSize='xs'
                    fontWeight={700}
                  >
                    ABI Params
                  </FormLabel>
                  {abiParams &&
                    abiParams.map((param, idx) => {
                      return (
                        <Box key={idx}>
                          <Text>{param.name}</Text>
                          <Input
                            name={'xparam' + param.name}
                            ref={register}
                            placeholder={param.type}
                            color='white'
                            focusBorderColor='secondary.500'
                          />
                        </Box>
                      );
                    })}
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
    <>
      <Text>You do not have a minion yet</Text>
      <Text>In beta add a free Minion Boost for your DAO here</Text>
    </>
  );
};

export default MinionProposalForm;
