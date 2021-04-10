import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Flex, Button, Link } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import MintGateCard from '../components/mintGateCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';

const MINTGATE_URL = 'https://link.mintgate.app/api';

const MintGate = ({ daoMetaData }) => {
  const [gates, setGates] = useState([]);
  const { address, injectedChain } = useInjectedProvider();
  const { daochain, daoid } = useParams();

  useEffect(() => {
    const fetchGates = async () => {
      const localGates = await axios.get(
        // `${MINTGATE_URL}/links?tid=${daoid}`,
        `${MINTGATE_URL}/links?tid=${'0xef3d8c4fbb1860fceab16595db7e650cd5ad51c1'}`,
      );
      if (localGates?.data?.links?.length > 0) {
        setGates(localGates.data.links);
      }
    };
    // if (daoid && daoMetaData && 'mintGate' in daoMetaData?.boosts) {
    fetchGates();
    // }
    // }, [daoid, daoMetaData]);
  }, []);
  // console.log(gates);

  const newGateButton = daoConnectedAndSameChain(
    address,
    injectedChain?.chainId,
    daochain,
  ) && (
    <Button as={Link} to={`/dao/${daochain}/${daoid}/proposals/new/member`}>
      New Gate
    </Button>
  );

  return (
    <MainViewLayout header='MintGates' headerEl={newGateButton} isDao>
      <Flex wrap='wrap' justify='space-around'>
        {gates.length > 0 &&
          gates.map((gate) => {
            console.log(gate);
            return <MintGateCard key={gate.title} gate={gate} />;
          })}
      </Flex>
    </MainViewLayout>
  );
};

export default MintGate;
