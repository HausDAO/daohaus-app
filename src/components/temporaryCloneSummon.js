import React, { useState } from 'react';
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { RiCheckLine, RiErrorWarningLine, RiSearchLine } from 'react-icons/ri';
import ContentBox from './ContentBox';
import { useForm } from 'react-hook-form';
import { HOME_DAO } from '../graphQL/dao-queries';
import { capitalize, isEthAddress } from '../utils/general';
import { getGraphEndpoint, supportedChains } from '../utils/chain';
import { graphQuery } from '../utils/apollo';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import { graphFetchAll } from '../utils/theGraph';

const TemporaryCloneSummon = ({ handleCloneDAO }) => {
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState('ready');

  const { theme } = useCustomTheme();

  const onSubmit = async (data) => {
    const daoID = data?.cloneByAddress.trim();
    const daoChain = data?.network;
    if (isEthAddress(daoID) && daoChain) {
      setStatus('loading');
      try {
        const overview = await graphQuery({
          endpoint: getGraphEndpoint(daoChain, 'subgraph_url'),
          query: HOME_DAO,
          variables: {
            contractAddr: daoID,
          },
        });

        const members = await graphFetchAll({
          endpoint: getGraphEndpoint(daoChain, 'subgraph_url'),
          query: MEMBERS_LIST,
          subfield: 'daoMembers',
          variables: {
            contractAddr: daoID,
          },
        });
        if (overview?.moloch && members?.length) {
          setStatus('success');
          handleCloneDAO(overview.moloch, members, daoChain);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    } else {
      setStatus('error');
    }
  };
  return (
    <ContentBox mt={6} maxWidth='600px'>
      <Box fontFamily='heading' fontSize='2xl' mb={3} fontWeight={700}>
        Clone a DAO by address
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Box>What is the DAO&apos;s current network?</Box>
        <Select
          placeholder='Select network'
          icon={<AiOutlineCaretDown />}
          name='network'
          ref={register({ required: true })}
          color='white'
          mb={6}
        >
          {Object.values(supportedChains)?.map((chain) => {
            return (
              <option
                key={chain.chain_id}
                value={chain.chain_id}
                color={theme.colors.whiteAlpha[900]}
                background={theme.colors.blackAlpha[900]}
              >
                {capitalize(chain.network)}
              </option>
            );
          })}
        </Select>
        <Box>What is the DAO&apos;s address?</Box>
        <InputGroup justifyContent='center' onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='cloneByAddress'
            ref={register({ required: true })}
            placeholder='0x12356789...'
            mb={5}
            color='white'
            focusBorderColor='secondary.500'
          />
          <InputRightAddon background='primary.500' p={0}>
            {status === 'ready' && (
              <Button size='md' variant='icon' type='submit'>
                <Icon as={RiSearchLine} />
              </Button>
            )}
            {status === 'loading' && (
              <Button size='md' variant='icon' type='submit'>
                <Icon as={Spinner} />
              </Button>
            )}
            {status === 'success' && (
              <Button size='md' variant='icon' type='submit'>
                <Icon as={RiCheckLine} />
              </Button>
            )}
            {status === 'error' && (
              <Button size='md' variant='icon' type='submit'>
                <Icon as={RiErrorWarningLine} />
              </Button>
            )}
          </InputRightAddon>
        </InputGroup>

        {status === 'success' && (
          <Box size='md' variant='icon' type='submit'>
            Address Found. Populated form with this DAOs data
          </Box>
        )}
        {status === 'error' && (
          <Box size='md' variant='icon' type='submit'>
            Could not find the address specified
          </Box>
        )}
      </form>
    </ContentBox>
  );
};

export default TemporaryCloneSummon;
