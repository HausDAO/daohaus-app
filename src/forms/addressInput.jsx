import React, { useEffect, useState } from 'react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { RiInformationLine } from 'react-icons/ri';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';
import { useDao } from '../contexts/DaoContext';
import { truncateAddr } from '../utils/general';
import { chainByID } from '../utils/chain';
// import { handleGetProfile } from '../utils/3box';
import { handleGetENS } from '../utils/ens';

const defaultTipLabel =
  'Address to receive the Shares, Loot, and/or Funding requested in this proposal. A DAO address cannot be the applicant on a proposal.';

const AddressInput = ({
  register,
  setValue,
  watch,
  formLabel = 'applicant',
  guildKick,
  tipLabel = defaultTipLabel,
  canClear,
  clearFn,
  memberOnly = false,
  memberOverride = false,
  overrideData,
}) => {
  const { theme } = useCustomTheme();
  const { daoMembers } = useDao();
  const [anyApplicant, setAnyApplicant] = useState(memberOnly);
  const [localMembers, setLocalMembers] = useState([]);

  const ensAddr = watch('applicantHidden', '');

  const handleChange = async e => {
    if (e.target.value.endsWith('.eth')) {
      const ethersProvider = ethers.getDefaultProvider(
        chainByID('0x1').rpc_url,
      );
      const address = await ethersProvider.resolveName(e.target.value);
      if (address) {
        setValue('applicantHidden', address);
      } else {
        setValue('applicantHidden', 'No ENS set');
      }
    } else {
      setValue('applicantHidden', '');
    }
  };

  useEffect(() => {
    let shouldSet = true;

    const getMemberName = async memberAddress => {
      // const profileResult = await handleGetProfile(memberAddress);
      // if (profileResult?.name) {
      //   return profileResult;
      // }

      const ensResult = await handleGetENS(memberAddress);
      if (ensResult) {
        return { name: ensResult };
      }

      return undefined;
    };

    const fetchDaoMembers = async () => {
      const memberProfiles = await Promise.all(
        daoMembers.map(async member => {
          return {
            ...member,
            ...(await getMemberName(member.memberAddress)),
          };
        }),
      );
      if (shouldSet) {
        setLocalMembers(memberProfiles);
      }
    };
    const fetchOverride = async () => {
      const memberProfiles = await Promise.all(
        overrideData.map(async member => {
          return {
            ...member,
            ...(await getMemberName(member.memberAddress)),
          };
        }),
      );
      if (shouldSet) {
        setLocalMembers(await memberProfiles);
      }
    };
    if (daoMembers && !memberOverride) {
      fetchDaoMembers();
    } else if (memberOverride && overrideData) {
      fetchOverride();
    } else {
      console.warn('Address input did not receive a valid members array');
    }

    return () => {
      shouldSet = false;
    };
  }, [daoMembers, memberOverride, overrideData]);

  return (
    <>
      {!anyApplicant ? (
        <FormControl>
          <Flex justify='space-between'>
            <Tooltip
              hasArrow
              shouldWrapChildren
              label={tipLabel}
              placement='top'
            >
              <TextBox
                as={FormLabel}
                size='xs'
                htmlFor='applicant'
                d='flex'
                alignItems='center'
              >
                {formLabel}
                <Icon as={RiInformationLine} ml={2} />
              </TextBox>
            </Tooltip>
            {canClear && clearFn && (
              <Button
                onClick={clearFn}
                variant='outline'
                size='xs'
                ml='auto'
                mr={2}
              >
                Clear
              </Button>
            )}
            {!guildKick && (
              <Button
                onClick={() => setAnyApplicant(true)}
                variant='outline'
                size='xs'
              >
                Select
              </Button>
            )}
          </Flex>
          <Input
            name='applicant'
            id='applicant'
            placeholder='0x'
            ref={register({
              required: {
                value: true,
                message: `${formLabel} is required`,
              },
            })}
            onChange={handleChange}
          />
          <FormHelperText fontSize='xs' id='applicant-helper-text' mb={1}>
            {ensAddr || 'Use ETH address or ENS'}
          </FormHelperText>
          <Input type='hidden' name='applicantHidden' ref={register} />
        </FormControl>
      ) : (
        <FormControl>
          <Flex justify='space-between'>
            <TextBox as={FormLabel} size='xs' htmlFor='memberApplicant'>
              {formLabel}
            </TextBox>
            {canClear && clearFn && (
              <Button
                onClick={clearFn}
                variant='outline'
                size='xs'
                ml='auto'
                mr={2}
              >
                Clear
              </Button>
            )}
            {!guildKick && !memberOnly ? (
              <Button
                onClick={() => setAnyApplicant(false)}
                variant='outline'
                size='xs'
              >
                Other
              </Button>
            ) : null}
          </Flex>
          <Select
            placeholder='Select member'
            icon={<AiOutlineCaretDown />}
            name='memberApplicant'
            ref={register}
            color='whiteAlpha.900'
          >
            {localMembers?.map(member => {
              return (
                <option
                  key={member.memberAddress}
                  value={member.memberAddress}
                  color={theme.colors.whiteAlpha[900]}
                  // background={theme.colors.blackAlpha[900]}
                >
                  {member?.name
                    ? member?.name
                    : truncateAddr(member.memberAddress)}
                </option>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default AddressInput;
