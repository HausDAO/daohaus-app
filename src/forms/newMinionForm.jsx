import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Icon,
  Input,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

import { MinionFactoryService } from '../services/minionFactoryService';
import { supportedChains } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { FORM } from '../data/forms';
import FormBuilder from '../formBuilder/formBuilder';

// <FormBuilder {...FORM.NEW_NEAPOLITAN_MINION} />

const NewMinionForm = ({ minionType }) => {
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoOverview, refetch, refreshAllDaoVaults } = useDao();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast } = useOverlay();
  const { daochain, daoid } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentMinionCount, setCurrentMinionCount] = useState(false);
  const [step, setStep] = useState(1);

  const [pendingTx, setPendingTx] = useState(null);
  // const now = (new Date().getTime() / 1000).toFixed();

  const minionCount = useMemo(() => {
    // daoOverview?.minions
    if (daoOverview) {
      console.log('daoOverview.minions', daoOverview.minions);
      return daoOverview.minions.filter(
        minion => minion.minionType === minionType,
      ).length;
    }
    return null;
  }, [daoOverview, minionType]);

  console.log('minionCount', minionCount);

  // const onSubmit = async values => {
  //   setLoading(true);
  //   // setStep(2);
  //   // let summonParams;
  //   // if (minionType === 'vanillaMinion') {
  //   //   summonParams = [daoid, values.details];
  //   // } else {
  //   //   summonParams = [daoid, values.details, values.minQuorum];
  //   // }

  //   // console.log('summonParams');
  // };

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploy Your Minion
          </Heading>
          {minionCount > 0 && (
            <>
              <Box mb={5} fontSize='sm'>
                {`You have ${minionCount} minion of this type
                ${minionCount > 1 ? 's' : ''} already. Are you
                looking for the `}
                <Link
                  as={RouterLink}
                  to={`/dao/${daochain}/${daoid}/settings`}
                  color='secondary.500'
                >
                  Settings?
                </Link>
              </Box>
            </>
          )}
          <Box mb={3} fontSize='sm'>
            Deploying a Minion will allow the DAO to interact with external
            contracts through proposals
          </Box>

          <FormBuilder {...FORM.NEW_NEAPOLITAN_MINION} />
        </>
      ) : null}

      {/* {step === 2 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploying Your Minion
          </Heading>
          <Spinner />

          <Box my={10}>
            {pendingTx ? (
              <Link
                href={`${supportedChains[daochain].block_explorer}/tx/${pendingTx}`}
                isExternal
                fontSize='2xl'
                color='secondary.500'
              >
                View Transaction
                <Icon as={RiExternalLinkLine} ml={2} />
              </Link>
            ) : null}
          </Box>
        </>
      ) : null} */}

      {/* {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            A Minion is at your service
          </Heading>
          <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
            Settings
          </Button>
        </>
      ) : null} */}
    </Box>
  );
};

export default NewMinionForm;
