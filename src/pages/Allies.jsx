import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

// import Following from '../components/followingDaos';
import { useParams } from 'react-router-dom';
import MainViewLayout from '../components/mainViewLayout';
import DaoToDaoManager from '../components/daoToDaoManager';
import DaoToDaoProposalModal from '../modals/daoToDaoProposalModal';
import DaoToDaoProposalTypeModal from '../modals/daoToDaoProposalTypeModal';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import NewUberHausMinion from '../forms/newUberHausMinion';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { bigGraphQuery } from '../utils/theGraph';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { UberHausMinionService } from '../services/uberHausMinionService';

const Allies = ({
  daoOverview,
  daoMetaData,
  isMember,
  proposals,
  daoMembers,
}) => {
  const { daoid } = useParams();

  const [uberProposals, setUberProposals] = useSessionStorage(
    'U-proposals',
    null,
  );
  const [uberOverview, setUberOveriew] = useSessionStorage('U-overview', null);
  const [uberMembers, setUberMembers] = useSessionStorage('U-members', null);
  const [uberDelegate, setUberDelegate] = useState(null);
  const { d2dProposalModal } = useOverlay();
  const [proposalType, setProposalType] = useState(null);
  const { address, requestWallet } = useInjectedProvider();

  const hasPerformedBatchQuery = useRef(false);

  useEffect(() => {
    // do not reload if truthy
    if (uberProposals || uberMembers || uberOverview) return;

    // do not fetch without necessary data
    if (!daoid || hasPerformedBatchQuery.current) return;

    const bigQueryOptions = {
      args: {
        daoID: UBERHAUS_DATA.ADDRESS,
        chainID: UBERHAUS_DATA.NETWORK,
      },
      getSetters: [
        { getter: 'getOverview', setter: setUberOveriew },
        {
          getter: 'getActivities',
          setter: { setUberProposals },
        },
        { getter: 'getMembers', setter: setUberMembers },
      ],
    };
    bigGraphQuery(bigQueryOptions);

    hasPerformedBatchQuery.current = true;
  }, [daoid, uberMembers, uberProposals, uberOverview, uberProposals]);

  const uberHausMinion = useMemo(() => {
    return daoOverview?.minions?.find(
      minion =>
        minion.minionType === 'UberHaus minion' &&
        minion.uberHausAddress === UBERHAUS_DATA.ADDRESS,
    );
  }, [daoOverview]);

  useEffect(() => {
    const getDelegate = async () => {
      try {
        const delegate = await UberHausMinionService({
          chainID: UBERHAUS_DATA.NETWORK,
          uberHausMinion: uberHausMinion.minionAddress,
        })('currentDelegate')();
        setUberDelegate(delegate);
      } catch (error) {
        console.error(error?.message);
      }
    };
    if (uberHausMinion) {
      getDelegate();
    }
  }, [uberHausMinion]);

  const refetchAllies = () => {
    const bigQueryOptions = {
      args: {
        daoID: UBERHAUS_DATA.ADDRESS,
        chainID: UBERHAUS_DATA.NETWORK,
      },
      getSetters: [
        { getter: 'getOverview', setter: setUberOveriew },
        {
          getter: 'getActivities',
          setter: { setUberProposals },
        },
        { getter: 'getMembers', setter: setUberMembers },
      ],
    };
    bigGraphQuery(bigQueryOptions);
    hasPerformedBatchQuery.current = true;
  };

  if (!address) {
    return (
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
        <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
          Connect your wallet.
        </Box>

        <Flex direction='column' align='center'>
          <Button onClick={requestWallet}>Connect Wallet</Button>
        </Flex>
      </Box>
    );
  }

  return (
    <MainViewLayout header='Allies' isDao>
      <Box>
        <DaoToDaoProposalTypeModal isOpen setProposalType={setProposalType} />
        <DaoToDaoProposalModal
          isOpen={d2dProposalModal}
          proposalType={proposalType}
          daoMembers={daoMembers}
          uberMembers={uberMembers}
          uberDelegate={uberDelegate}
          uberHausMinion={uberHausMinion}
          uberOverview={uberOverview}
          refetchAllies={refetchAllies}
        />
        <GenericModal closeOnOverlayClick modalId='uberMinionLaunch'>
          <NewUberHausMinion
            daoMembers={daoMembers}
            uberHausMinion={uberHausMinion}
            uberMembers={uberMembers}
            uberDelegate={uberDelegate}
          />
        </GenericModal>
        <DaoToDaoManager
          uberDelegate={uberDelegate}
          daoOverview={daoOverview}
          daoMetaData={daoMetaData}
          setProposalType={setProposalType}
          isMember={isMember}
          uberProposals={uberProposals}
          uberMembers={uberMembers}
          uberOverview={uberOverview}
          daoProposals={proposals}
          refetchAllies={refetchAllies}
        />
        {/* <Following /> */}
      </Box>
    </MainViewLayout>
  );
};

export default Allies;
