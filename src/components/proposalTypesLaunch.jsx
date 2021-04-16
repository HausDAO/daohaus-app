import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react';

import { useMetaData } from '../contexts/MetaDataContext';
import { getTerm } from '../utils/metadata';

const ProposalTypesLaunch = ({ handleLaunch, loading, setLoading }) => {
  const { daochain, daoid } = useParams();
  const { customTerms } = useMetaData();
  const [step, setStep] = useState(1);

  const onSubmit = async () => {
    setLoading(true);
    const proposalTypes = {
      member: { active: true },
      funding: { active: true },
      whitelist: { active: true },
      trade: { active: true },
      guildKick: { active: true },
      lootGrab: { active: false, ratio: 1 },
      transmutation: { active: false },
      minion: { active: false },
    };

    const success = await handleLaunch(proposalTypes);
    if (success) {
      setStep('success');
    }
  };

  if (loading) {
    return (
      <Box w='90%'>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            {`Configure ${getTerm(customTerms, 'proposal')} Types`}
          </Heading>
          <Text my={6}>
            You can override the proposal types to turn some off and customize
            any parameters available.
          </Text>

          <Button type='submit' disabled={loading} onClick={onSubmit}>
            Lets do it!
          </Button>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Proposal types unlocked
          </Heading>
          <Text my={6}>
            You can now customize the proposal types for your DAO! You can edit
            these later in Settings &gt; Proposals.
          </Text>
          <Button
            as={RouterLink}
            to={`/dao/${daochain}/${daoid}/settings/proposals`}
          >
            Edit Proposal Types
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default ProposalTypesLaunch;
