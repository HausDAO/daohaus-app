import React, { useEffect, useState } from 'react';
import { Flex, Icon, Box, Button } from '@chakra-ui/react';
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import Layout from '../components/layout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { supportedChains } from '../utils/chain';
import DaoMetaForm from '../forms/daoMetaForm';
import { useUser } from '../contexts/UserContext';
import { useSessionStorage } from '../hooks/useSessionStorage';

const Register = () => {
  const { registerchain, registerid } = useParams();
  const { refetch } = useUser();
  const history = useHistory();
  const { address, injectedChain, requestWallet } = useInjectedProvider();
  const [, setExploreDaos] = useSessionStorage('exploreDaoData');
  const [currentDao, setCurrentDao] = useState();
  const [needsNetworkChange, setNeedsNetworkChange] = useState();

  useEffect(() => {
    if (address && injectedChain) {
      setCurrentDao({
        address: registerid,
        name: '',
        description: '',
        purpose: '',
        summonerAddress: address,
        version: '2.1',
      });

      setNeedsNetworkChange(injectedChain.chain_id !== registerchain);
    }
  }, [address, injectedChain]);

  const handleUpdate = async (values) => {
    console.log('updated dao', values);
    refetch();
    setExploreDaos({
      chains: [],
      data: [],
    });

    history.push(`/dao/${registerchain}/${registerid}`);
  };

  return (
    <Layout>
      {injectedChain && !needsNetworkChange ? (
        <>
          {!currentDao ? (
            <Box
              fontSize={['lg', null, null, '3xl']}
              fontFamily='heading'
              fontWeight={700}
              ml={10}
            >
              loading...
            </Box>
          ) : (
            <>
              <Flex ml={6} justify='space-between' align='center' w='100%'>
                <Flex as={RouterLink} to={`/`} align='center'>
                  <Icon as={BiArrowBack} color='secondary.500' mr={2} />
                  Back
                </Flex>
              </Flex>
              <Box w='40%'>
                <DaoMetaForm
                  handleUpdate={handleUpdate}
                  metadata={currentDao}
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <Box
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          p={6}
          m={[10, 'auto', 0, 'auto']}
          w='50%'
          textAlign='center'
        >
          {!injectedChain ? (
            <>
              <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
                Connect your wallet to register your dao.
              </Box>

              <Flex direction='column' align='center'>
                <Button onClick={requestWallet}>Connect Wallet</Button>
              </Flex>
            </>
          ) : (
            <Box
              fontSize={['lg', null, null, '3xl']}
              fontFamily='heading'
              fontWeight={700}
              ml={10}
            >
              You need to switch your network to{' '}
              {supportedChains[registerchain].name} to register this dao.
            </Box>
          )}
        </Box>
      )}
    </Layout>
  );
};

export default Register;
