import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Heading, Link } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { FORM } from '../data/forms';
import FormBuilder from '../formBuilder/formBuilder';

const NewMinionForm = ({ minionType }) => {
  const { daoOverview, refetch, refreshAllDaoVaults } = useDao();
  const { daochain, daoid } = useParams();
  const [step, setStep] = useState(1);

  const minionCount = useMemo(() => {
    if (daoOverview) {
      return daoOverview.minions.filter(
        minion => minion.minionType === minionType,
      ).length;
    }
    return null;
  }, [daoOverview, minionType]);

  const transactionLego = useMemo(() => {
    console.log('minionType', minionType);
    if (minionType === 'Neapolitan minion') {
      return FORM.NEW_NEAPOLITAN_MINION;
    }
    if (minionType === 'vanilla minion') {
      return FORM.NEW_VANILLA_MINION;
    }
    if (minionType === 'nifty minion') {
      return FORM.NEW_NIFTY_MINION;
    }

    return null;
  }, [minionType]);

  const handleAfterTransaction = async () => {
    await refreshAllDaoVaults();
    refetch();
    setStep('success');
  };

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

          {!transactionLego && <Box>Error loading minion type</Box>}

          {transactionLego && (
            <FormBuilder
              {...transactionLego}
              lifeCycleFns={{
                onPollSuccess() {
                  handleAfterTransaction();
                },
              }}
            />
          )}
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            A Minion is at your service
          </Heading>
          <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
            Settings
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default NewMinionForm;
