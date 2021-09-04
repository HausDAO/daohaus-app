import React, { useState, useEffect } from 'react';
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

// import BoostStatus from '../components/boostStatus';
// import Superpowers from '../components/daoSuperpowers';
import DaoContractSettings from '../components/daoContractSettings';
import DaoMetaOverview from '../components/daoMetaOverview';
import TextBox from '../components/TextBox';
// import Minions from '../components/minionList';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { fetchTransmutation, getWrapNZap } from '../utils/theGraph';

const Settings = ({ overview, daoMember, daoMetaData, customTerms }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const [wrapNZap, setWrapNZap] = useState(null);
  const [transmutationContract, setTransmutationContract] = useState(null);

  useEffect(() => {
    const getWNZ = async () => {
      setWrapNZap(await getWrapNZap(daochain, daoid));
      const transmutationRes = await fetchTransmutation({
        chainID: daochain,
        molochAddress: daoid,
      });

      if (transmutationRes.transmutations[0]) {
        setTransmutationContract(
          transmutationRes.transmutations[0].transmutation,
        );
      }
      // setTransmutationContract();
    };
    getWNZ();
  }, [daoid]);

  return (
    <MainViewLayout header='Settings' customTerms={customTerms} isDao>
      <Flex wrap='wrap'>
        <Box
          w={['100%', null, null, null, '50%']}
          pr={[0, null, null, null, 6]}
          pb={6}
        >
          <TextBox size='xs'>Dao Contract Settings</TextBox>
          <DaoContractSettings
            overview={overview}
            customTerms={customTerms}
            wrapNZap={wrapNZap}
            transmutationContract={transmutationContract}
          />
          <Flex justify='space-between' mt={6}>
            <TextBox size='xs'>DAO Metadata</TextBox>
            {daoConnectedAndSameChain(
              address,
              daochain,
              injectedChain?.chainId,
            ) && +daoMember?.shares > 0 ? (
              <Link
                as={RouterLink}
                color='secondary.500'
                fontFamily='heading'
                fontSize='xs'
                textTransform='uppercase'
                letterSpacing='0.15em'
                to={`/dao/${daochain}/${daoid}/settings/meta`}
              >
                Edit
              </Link>
            ) : null}
          </Flex>
          <DaoMetaOverview daoMetaData={daoMetaData} />
        </Box>
        <Stack w={['100%', null, null, null, '50%']} spacing={4}>
          {/* {daoMetaData?.boosts &&
          Object.keys(daoMetaData?.boosts).length > 0 ? (
            <Stack spacing={2}>
              <TextBox size='xs'>Superpowers</TextBox>
              <Superpowers daoMetaData={daoMetaData} daoMember={daoMember} />
            </Stack>
          ) : null}
          {overview?.minions?.length > 0 && (
            <Stack spacing={2}>
              <TextBox size='xs'>Minions</TextBox>
              <Minions />
            </Stack>
          )} */}
          {/* <Stack spacing={2}>
            <TextBox size='xs'>Boost Status</TextBox>
            <BoostStatus />
          </Stack> */}
        </Stack>
      </Flex>
    </MainViewLayout>
  );
};

export default Settings;
