import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Button, Link, Spinner, Box } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import MainViewLayout from '../components/mainViewLayout';
import MintGateCard from '../components/mintGateCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { getMintGates } from '../utils/requests';
import BoostNotActive from '../components/boostNotActive';
import TextBox from '../components/TextBox';
import { chainByID } from '../utils/chain';
import { useOverlay } from '../contexts/OverlayContext';

const MintGate = ({ daoMetaData }) => {
  const [gates, setGates] = useState([]);
  const { address, injectedChain } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const [loading, setLoading] = useState(true);
  const { errorToast } = useOverlay();

  useEffect(() => {
    const fetchGates = async () => {
      try {
        const localGates = await getMintGates(daoid);
        if (localGates?.links?.length > 0) {
          setGates(localGates.links);
        }
      } catch (err) {
        console.log(err);
        errorToast({
          title: 'Fetching MintGate gates failed.',
        });
      }
      setLoading(false);
    };
    if (daoid && daoMetaData && 'mintGate' in daoMetaData?.boosts) {
      fetchGates();
    }
  }, [daoid, daoMetaData]);

  const newGateButton = daoConnectedAndSameChain(
    address,
    injectedChain?.chainId,
    daochain,
  ) && (
    <Button
      as={Link}
      href={`https://www.mintgate.app/create_link?url&token1=${daoid}&amount1=1&type1=2&network1=${
        chainByID(daochain).network_id
      }`}
      rightIcon={<RiAddFill />}
      isExternal
    >
      New Gate
    </Button>
  );

  return (
    <MainViewLayout header='MintGates' headerEl={newGateButton} isDao>
      <Flex wrap='wrap' justify='space-around'>
        {!loading ? (
          daoMetaData && 'mintGate' in daoMetaData?.boosts ? (
            gates.length > 0 ? (
              gates.map(gate => <MintGateCard key={gate.title} gate={gate} />)
            ) : (
              <Box mt='100px'>
                <TextBox variant='value' size='lg'>
                  No Gates Found. Get started by creating your first gate!
                </TextBox>
              </Box>
            )
          ) : (
            <BoostNotActive />
          )
        ) : (
          <Spinner size='xl' mt='100px' />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default MintGate;
