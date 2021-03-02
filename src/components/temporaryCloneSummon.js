import React, { useState } from 'react';
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';
import ContentBox from './ContentBox';
import { useForm } from 'react-hook-form';
import { HOME_DAO } from '../graphQL/dao-queries';
import { isEthAddress } from '../utils/general';
import { getGraphEndpoint } from '../utils/chain';
import { graphQuery } from '../utils/apollo';

const TemporaryCloneSummon = ({ chainID }) => {
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState('ready');

  // export const graphQuery = async ({ endpoint, query, variables }) => {
  //   try {
  //     const client = createClient(endpoint);
  //     const results = await client.query({
  //       query,
  //       variables,
  //     });
  //     return results.data;
  //   } catch (error) {
  //     console.error(error);
  //     return error;
  //   }
  // };

  const onSubmit = async (data) => {
    const daoID = data?.cloneByAddress;
    if (isEthAddress(daoID)) {
      try {
        const res = await graphQuery({
          endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
          query: HOME_DAO,
          variables: {
            contractAddr: daoID,
          },
        });
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    } else {
      // set Error UI
    }
  };
  return (
    <ContentBox mt={6} maxWidth='600px'>
      <Box fontFamily='heading' fontSize='2xl' mb={3} fontWeight={700}>
        Clone a DAO by address
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Box mb={3}>
          Have a DAO&apos;s address? Search for a DAO address and populate the
          form with the data
        </Box>
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
          </InputRightAddon>
        </InputGroup>
      </form>
    </ContentBox>
  );
};

export default TemporaryCloneSummon;
