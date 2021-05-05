import React, { useEffect, useState } from 'react';
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
import { isEthAddress, truncateAddr } from '../utils/general';
import { getActiveMembers } from '../utils/dao';
import { lookupENS } from '../utils/ens';

const ProposalForm = ({ fields, tx, onTx, additionalOptions = null }) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(fields);
  const [options, setOptions] = useState(additionalOptions);
  // const { newDaoProposal } = useTX();
  const localForm = useForm();
  const { handleSubmit } = localForm;

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));
    setFields([...formFields, selectedOption]);
  };
  const onSubmit = values => {
    console.log('values', values);
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
        <FormFooter options={options} addOption={addOption} />
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
  if (type === 'linkInput') {
    return <LinkInput {...props} />;
  }
  if (type === 'applicantInput') {
    return <AddressInput {...props} />;
  }
  if (type === 'inputSelect') {
    return <InputSelect {...props} />;
  }
  return null;
};

//  COMBOS
const FieldWrapper = ({ children, label, info, htmlFor, helperText, btn }) => {
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
        <SubmitFormError message={error.msg} key={`${error.msg}-${index}`} />
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
  valOnType = [],
  valOnSubmit = [],
  localForm,
  helperText,
  btn,
  append,
  info,
  prepend,
  onChange = null,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
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
          ref={register({
            required: {
              value: true,
              message: 'Required',
            },
          })}
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
  const { options } = props;

  return (
    <GenericInput
      {...props}
      append={
        <Select>
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
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
    >
      <Textarea
        id={htmlFor}
        name={name}
        placeholder={placeholder || label || htmlFor}
        h={h}
        ref={register({
          required: {
            value: true,
            message: 'Required',
          },
        })}
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
}) => {
  const { register } = localForm;
  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
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
