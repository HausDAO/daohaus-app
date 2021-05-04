import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiSearchLine,
} from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { isEthAddress } from '../utils/general';
import AddressInput from '../forms/addressInput';

const TemporaryPopoverFix = styled.span`
  .css-n0uled {
    max-width: 100%;
  }
`;

const defaultFilters = [
  { value: 'proposer', name: 'Submitted By', active: true },
  { value: 'sponsor', name: 'Sponsored By', active: true },
  { value: 'applicant', name: 'Is Applicant', active: true },
  { value: 'processor', name: 'Processed By', active: true },
];

const ProposalSearch = ({ performSearch, resetSearch }) => {
  const [searchFilters, setSearchFilters] = useState(defaultFilters);
  const {
    handleSubmit,
    errors,
    register,
    setValue,
    setError,
    watch,
    reset,
  } = useForm();

  const [isEnabled, setIsEnabled] = useState(false);

  const inputAddr = watch('applicant');
  const inputENS = watch('applicantHidden');
  const selectAddr = watch('memberApplicant');

  const handleSearch = string => {
    performSearch(string, searchFilters);
  };

  useEffect(() => {
    if (isEthAddress(inputAddr)) {
      handleSearch(inputAddr);
      setIsEnabled(true);
    } else if (isEthAddress(inputENS)) {
      handleSearch(inputENS);
      setIsEnabled(true);
    } else if (isEthAddress(selectAddr)) {
      handleSearch(selectAddr);
      setIsEnabled(true);
    }
  }, [inputAddr, inputENS, selectAddr, searchFilters]);

  const onSubmit = values => {
    if (isEthAddress(values.applicant)) {
      handleSearch(values.applicant);
    } else if (isEthAddress(values.applicantHidden)) {
      handleSearch(values.applicantHidden);
    } else {
      setError('applicant', {
        type: 'manual',
        message: 'Did not receive a valid Ethereum or ENS address',
      });
    }
  };

  const handleToggleFilter = e => {
    const filterType = e?.target?.value;
    if (filterType) {
      setSearchFilters(prevState =>
        prevState.map(filter =>
          filter.value === filterType
            ? { ...filter, active: !filter.active }
            : filter,
        ),
      );
    }
  };
  const clearSearch = () => {
    console.log('fired');
    reset();
    setIsEnabled(false);
    resetSearch();
  };

  return (
    <Flex
      direction='row'
      w={['90%', null, null, '60%']}
      mb={[5, null, null, 0]}
      justifyContent={['flex-start', null, null, 'flex-end']}
      position={['relative', null, null, 'absolute']}
      right='0'
      mt='1'
      zIndex='5'
    >
      <Popover placement='bottom-end'>
        <PopoverTrigger>
          <Button
            textTransform='uppercase'
            fontFamily='heading'
            mr={3}
            fontSize={['md', null, null, 'lg']}
            variant='text'
            p='0'
            h='inherit'
            zIndex='15'
            leftIcon={isEnabled && <RiSearchLine />}
          >
            <Icon
              fontSize={20}
              title='Search'
              as={RiSearchLine}
              color='white'
            />
          </Button>
        </PopoverTrigger>
        <TemporaryPopoverFix>
          <PopoverContent
            p='6'
            mt='1'
            rounded='lg'
            bg='rgba(0,0,0,0.85)'
            borderWidth='1px'
            borderColor='whiteAlpha.200'
            mr='-10px'
          >
            <Text
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              variant='text'
              mb={6}
            >
              search by address
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddressInput
                watch={watch}
                register={register}
                setValue={setValue}
                canClear={isEnabled}
                clearFn={clearSearch}
                formLabel='Member address'
                tipLabel='Search proposals by Ethereum address or ENS address, or select a member from the dropdown.'
              />
            </form>

            <AddressFilterOptions
              filters={searchFilters}
              handleToggleFilter={handleToggleFilter}
            />
            {errors.applicant && (
              <Box color='red.500' fontSize='m' mr={5}>
                <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
                {errors.applicant.message}
              </Box>
            )}
          </PopoverContent>
        </TemporaryPopoverFix>
      </Popover>
    </Flex>
  );
};
export default ProposalSearch;

const AddressFilterOptions = ({ filters, handleToggleFilter }) => (
  <>
    {filters.map(filter => (
      <Flex key={filter.value}>
        <Button
          textTransform='uppercase'
          fontFamily='heading'
          mb={3}
          fontSize='sm'
          p={0}
          variant='text'
          color={filter.active ? 'white' : 'grey'}
          h='inherit'
          onClick={handleToggleFilter}
          value={filter.value}
          _hover={filter.active ? { color: 'secondary.500' } : {}}
          leftIcon={
            filter.active ? (
              <Icon
                as={RiCheckboxCircleLine}
                h='24px'
                w='24px'
                value={filter.value}
                onClick={handleToggleFilter}
              />
            ) : (
              <Icon
                as={RiCloseCircleLine}
                h='24px'
                w='24px'
                value={filter.value}
                onClick={handleToggleFilter}
              />
            )
          }
        >
          {filter.name}
        </Button>
      </Flex>
    ))}
  </>
);
