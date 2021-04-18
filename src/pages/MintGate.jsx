import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Button, Link } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import MainViewLayout from '../components/mainViewLayout';
import MintGateCard from '../components/mintGateCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { getMintGates } from '../utils/requests';
import BoostNotActive from '../components/boostNotActive';
import { chainByID } from '../utils/chain';

const MintGate = ({ daoMetaData }) => {
  const [gates, setGates] = useState([]);
  const { address, injectedChain } = useInjectedProvider();
  const { daochain, daoid } = useParams();

  useEffect(() => {
    const fetchGates = async () => {
      const localGates = await getMintGates(daoid);
      if (localGates?.links?.length > 0) {
        setGates(localGates.links);
      }
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
      href={`https://www.mintgate.app/create_link?url&token1=${daoid}&amount1=1&type1=2&network1=${chainByID(daochain).network_id}`}
      rightIcon={<RiAddFill />}
      isExternal
    >
      New Gate
    </Button>
  );

  return (
    <MainViewLayout header='MintGates' headerEl={newGateButton} isDao>
      <Flex wrap='wrap' justify='space-around'>
        {gates.length > 0 ? (
          gates.map((gate) => <MintGateCard key={gate.title} gate={gate} />) 
        ) : (
          <BoostNotActive />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default MintGate;
