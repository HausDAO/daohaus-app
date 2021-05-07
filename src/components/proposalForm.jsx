import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Box,
  Flex,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  Menu,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
  Select,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  FormHelperText,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import {
  RiAddFill,
  RiErrorWarningLine,
  RiInformationLine,
} from 'react-icons/ri';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { useDao } from '../contexts/DaoContext';
import { handleGetProfile } from '../utils/3box';
import { isEthAddress, truncateAddr, handleDecimals } from '../utils/general';
import { getActiveMembers } from '../utils/dao';
import { lookupENS } from '../utils/ens';
import { useTX } from '../contexts/TXContext';
import { fetchBalance } from '../utils/tokenValue';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { utils } from 'web3';
import { TokenService } from '../services/tokenService';
import { checkFormTypes, validateRequired } from '../utils/validation';

/// UTILS

const getRequiredFields = (fields, required) => {
  return fields.filter(field => {
    return required.includes(field.name);
  });
};

const ProposalForm = ({
  fields,
  tx,
  onTx,
  additionalOptions = null,
  required,
}) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(fields);
  const [options, setOptions] = useState(additionalOptions);

  const localForm = useForm();
  const { handleSubmit } = localForm;

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));
    setFields([...formFields, selectedOption]);
  };

  const updateErrors = errors => {
    setFields(prevFields =>
      prevFields.map(field => {
        const error = errors.find(error => error.name === field.name);
        if (error) {
          return { ...field, error };
        } else {
          return { ...field, error: false };
        }
      }),
    );
  };
  const clearErrors = () => {
    setFields(prevFields =>
      prevFields.map(field => ({ ...field, error: false })),
    );
  };
  const onSubmit = values => {
    clearErrors();
    setLoading(true);
    const missingVals = validateRequired(
      values,
      getRequiredFields(formFields, required),
    );
    if (missingVals) {
      updateErrors(missingVals);
      setLoading(false);
      return;
    }
    const typeErrors = checkFormTypes(values, formFields);
    console.log(`typeErrors`, typeErrors);
    if (typeErrors) {
      updateErrors(typeErrors);
      setLoading(false);
      return;
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl
          // isInvalid={errors.name}
          display='flex'
          mb={5}
        >
          <Flex w='100%' flexWrap='wrap' justifyContent='space-between'>
            {formFields?.map(field => {
              return (
                <InputFactory
                  key={field?.htmlFor || field?.name}
                  {...field}
                  localForm={localForm}
                />
              );
            })}
          </Flex>
        </FormControl>
        <FormFooter options={options} addOption={addOption} loading={loading} />
      </Flex>
    </form>
  );
};

export default ProposalForm;

const InputFactory = props => {
  const { type } = props;
  if (type === 'input') {
    return <GenericInput {...props} />;
  }
  if (type === 'textarea') {
    return <GenericTextarea {...props} />;
  }
  if (type === 'inputSelect') {
    return <InputSelect {...props} />;
  }
  if (type === 'linkInput') {
    return <LinkInput {...props} />;
  }
  if (type === 'applicantInput') {
    return <AddressInput {...props} />;
  }
  if (type === 'tributeInput') {
    return <TributeInput {...props} />;
  }
  if (type === 'paymentInput') {
    return <PaymentInput {...props} />;
  }
  return null;
};

//  COMBOS
const FieldWrapper = ({
  children,
  label,
  info,
  htmlFor,
  helperText,
  btn,
  error,
}) => {
  return (
    <Flex w={['100%', null, '48%']} mb={3} flexDir='column'>
      <Flex>
        <TextBox as={FormLabel} size='xs' htmlFor={htmlFor}>
          {label}
          {info && (
            <ToolTipWrapper
              tooltip
              tooltipText={{ body: info }}
              placement='right'
              layoutProps={{ transform: 'translateY(-2px)' }}
            >
              <Icon as={RiInformationLine} ml={2} />
            </ToolTipWrapper>
          )}
        </TextBox>
        {btn && <Flex ml='auto'>{btn}</Flex>}
      </Flex>

      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <SubmitFormError message={error.message} />}
    </Flex>
  );
};

const FormFooter = ({ options, loading, addOption, errors }) => {
  if (options?.length) {
    return (
      <Box>
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex mb={2}>
            <AdditionalOptions
              mr='auto'
              options={options}
              addOption={addOption}
            />
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
              borderBottomLeftRadius='0'
              borderTopLeftRadius='0'
            >
              Submit
            </Button>
          </Flex>
          <SubmitErrList errors={errors} />
        </Flex>
      </Box>
    );
  }
  return (
    <Flex justifyContent='flex-end'>
      <Button
        type='submit'
        loadingText='Submitting'
        isLoading={loading}
        disabled={loading}
      >
        Submit
      </Button>
    </Flex>
  );
};

const SubmitErrList = ({ errors = [] }) => {
  //  determine which errors are submit errors
  return (
    <Flex flexDirection='column' alignItems='flex-start'>
      {errors.map((error, index) => (
        <SubmitFormError
          message={error.message}
          key={`${error.message}-${index}`}
        />
      ))}
    </Flex>
  );
};

//  PRIMITIVES

const SubmitFormError = ({ message }) => (
  <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
    <Icon
      as={RiErrorWarningLine}
      color='secondary.300'
      mr={1}
      transform='translateY(2px)'
    />
    {message}
  </Flex>
);

const ModButton = ({ label, callback, selected = true }) => (
  <Button onClick={callback} variant='outline' size='xs'>
    {label}
  </Button>
);

//  GENERICS

const GenericInput = ({
  label,
  htmlFor,
  placeholder,
  name,
  localForm,
  helperText,
  btn,
  append,
  info,
  prepend,
  onChange = null,
  error,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
    >
      <InputGroup>
        {prepend && (
          <InputLeftAddon background='primary.600'>{prepend}</InputLeftAddon>
        )}
        <Input
          id={htmlFor}
          name={name}
          onChange={onChange}
          placeholder={placeholder || label || htmlFor}
          ref={register}
        />
        {append && (
          <InputRightAddon background='primary.600' p={0}>
            {append}
          </InputRightAddon>
        )}
      </InputGroup>
    </FieldWrapper>
  );
};

const InputSelect = props => {
  const { options, selectName, localForm, onChange } = props;
  const { register } = localForm;

  return (
    <GenericInput
      {...props}
      append={
        <Select
          name={selectName || 'select'}
          onChange={onChange}
          ref={register}
        >
          {options?.map((option, index) => (
            <option key={`${option?.value}-${index}`} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
      }
    />
  );
};

const GenericTextarea = ({
  label,
  htmlFor,
  placeholder,
  name,
  valOnType = [],
  valOnSubmit = [],
  btn,
  helperText,
  localForm,
  info,
  h = 10,
  error,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
    >
      <Textarea
        id={htmlFor}
        name={name}
        placeholder={placeholder || label || htmlFor}
        h={h}
        ref={register}
      />
    </FieldWrapper>
  );
};

const GenericSelect = ({
  label,
  htmlFor,
  placeholder,
  name,
  valOnType = [],
  valOnSubmit = [],
  localForm,
  helperText,
  btn,
  append,
  info,
  prepend,
  options = [],
  error,
}) => {
  const { register } = localForm;
  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
    >
      <Select placeholder={placeholder} ref={register} id={htmlFor} name={name}>
        {options?.map(option => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </Select>
    </FieldWrapper>
  );
};

const AdditionalOptions = ({ options = [], addOption }) => {
  return (
    <Box>
      <Menu color='white' textTransform='uppercase'>
        <MenuButton
          as={Button}
          variant='outline'
          rightIcon={<Icon as={RiAddFill} />}
          borderTopRightRadius='0'
          borderBottomRightRadius='0'
          type='button'
        >
          Additional Options
        </MenuButton>
        <MenuList>
          {options?.map(option => {
            return (
              <MenuItem
                key={option.htmlFor}
                onClick={addOption}
                value={option.htmlFor}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

//  Specialized Fields
const LinkInput = props => {
  return <GenericInput {...props} prepend='https://' />;
};

const AddressInput = props => {
  const { name, localForm } = props;
  const [textMode, setTextMode] = useState(true);
  const [userAddresses, setAddresses] = useState([]);
  const [helperText, setHelperText] = useState('Use ETH address or ENS');
  const { daoMembers } = useDao();

  const { setValue } = localForm;

  useEffect(async () => {
    let shouldSet = true;
    if (daoMembers) {
      const memberProfiles = Promise.all(
        getActiveMembers(daoMembers)?.map(async member => {
          const profile = await handleGetProfile(member.memberAddress);
          if (profile?.status !== 'error') {
            return { name: profile.name, value: member.memberAddress };
          }
          return {
            name: truncateAddr(member.memberAddress),
            value: member.memberAddress,
          };
        }),
      );
      if (shouldSet) {
        setAddresses(await memberProfiles);
      }
    }
    return () => {
      shouldSet = false;
    };
  }, [daoMembers]);

  const switchElement = () => {
    setTextMode(prevState => !prevState);
  };

  const handleLookupENS = async ens => {
    setHelperText(<Spinner />);
    const result = await lookupENS(ens);
    if (result) {
      setHelperText(ens);
      setValue(name, result);
    } else {
      setHelperText('No ENS Set');
    }
  };

  const checkApplicant = e => {
    if (e?.target?.value == null) return;
    const input = e.target.value;
    if (isEthAddress(input)) {
      setHelperText('Valid Address');
    } else if (input.endsWith('.eth')) {
      handleLookupENS(input);
    } else {
      setHelperText('Use ETH address or ENS');
    }
  };

  return (
    <>
      {textMode ? (
        <GenericInput
          {...props}
          btn={<ModButton label='Select' callback={switchElement} />}
          onChange={checkApplicant}
          helperText={helperText}
        />
      ) : (
        <GenericSelect
          {...props}
          placeholder='Select an Address'
          options={userAddresses}
          btn={<ModButton label='Input' callback={switchElement} />}
        />
      )}
    </>
  );
};

const TributeInput = props => {
  const { unlockToken } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { getValues, setValue } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState('loading');
  const [loading, setLoading] = useState(false);

  const maxBtnDisplay = useMemo(() => {
    if (balance === 'loading') {
      return <Spinner size='sm' />;
    }
    if (balance) {
      const commified = ethers.utils.commify(
        Number(utils.fromWei(balance)).toFixed(4),
      );
      return `Max: ${commified}`;
    }
  }, [balance]);

  const unlockBtnDisplay = loading ? <Spinner size='sm' /> : 'Unlock';

  useEffect(() => {
    if (daoOverview) {
      const depTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depTokenAddress,
      );
      setDaoTokens(
        [depositToken, ...nonDepTokens].map(token => ({
          value: token.token.tokenAddress,
          name: token.token.symbol || token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    let shouldUpdate = true;
    const setInitialBalance = async () => {
      const tokenAddress = daoTokens[0]?.value;
      const result = await fetchBalance({
        tokenAddress,
        address,
        chainID: daochain,
      });
      if (shouldUpdate) {
        setBalance(result);
      }
    };
    if (daoTokens?.length) {
      setInitialBalance();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [daoTokens, address, daochain]);

  const updateBalance = async tokenAddress => {
    const result = await fetchBalance({
      tokenAddress,
      address,
      chainID: daochain,
    });
    setBalance(result);
  };

  const handleUnlock = async () => {
    const tokenAddress = getValues('tributeToken');
    setLoading(true);
    const result = await unlockToken(tokenAddress);
    setLoading(false);
    setUnlocked(result);
  };

  const setMax = () => {
    const tributeToken = getValues('tributeToken');
    setValue(
      'tributeOffered',
      balance / 10 ** daoTokens.find(t => t.value === tributeToken)?.decimals,
    );
    handleChange();
  };

  const checkUnlocked = async (token, amount) => {
    if (
      amount === '' ||
      !token ||
      typeof +amount !== 'number' ||
      +amount === 0
    ) {
      setUnlocked(true);
      return;
    }
    const amountApproved = await TokenService({
      chainID: daochain,
      tokenAddress: token,
    })('allowance')({
      accountAddr: address,
      contractAddr: daoid,
    });
    const isUnlocked = +amountApproved > +amount;
    setUnlocked(isUnlocked);
  };

  const handleChange = async () => {
    const tributeToken = getValues('tributeToken');
    const tributeOffered = getValues('tributeOffered');

    checkUnlocked(tributeToken, tributeOffered);
    updateBalance(tributeToken);
  };

  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      onChange={handleChange}
      helperText={unlocked || 'Unlock to tokens to submit proposal'}
      btn={
        unlocked ? (
          <ModButton label={maxBtnDisplay} callback={setMax} />
        ) : (
          <>
            <ModButton label={unlockBtnDisplay} callback={handleUnlock} />
            <ModButton label={maxBtnDisplay} callback={setMax} />
          </>
        )
      }
    />
  );
};

const getMaxBalance = (tokenData, tokenAddress) => {
  //  Uses token select data structure
  const token = tokenData.find(t => t.value === tokenAddress);
  console.log(token);
  if (token) {
    return handleDecimals(token.balance, token.decimals);
  }
};

const PaymentInput = props => {
  // const { address } = useInjectedProvider();
  // const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { getValues, setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);

  const [balance, setBalance] = useState(null);

  const paymentToken = watch('paymentToken');
  const maxBtnDisplay =
    balance || balance === 0
      ? `Max: ${balance.toFixed(4)}`
      : 'Error: Not found.';

  useEffect(() => {
    //  REFACTOR
    if (daoOverview) {
      const depTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depTokenAddress,
      );
      // setValue('paymentToken', depositToken?.token?.tokenAddress);
      setDaoTokens(
        [depositToken, ...nonDepTokens].map(token => ({
          value: token.token.tokenAddress,
          name: token.token.symbol || token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    const tokenAddr = paymentToken || getValues('paymentToken');
    if (daoTokens?.length && tokenAddr) {
      const bal = getMaxBalance(daoTokens, tokenAddr);
      setBalance(bal);
    }
  }, [daoTokens, paymentToken]);

  const setMax = () => {
    setValue('paymentRequested', balance);
  };

  return (
    <InputSelect
      {...props}
      selectName='paymentToken'
      options={daoTokens}
      // helperText={unlocked || 'Unlock to tokens to submit proposal'}
      btn={<ModButton label={maxBtnDisplay} callback={setMax} />}
    />
  );
};
