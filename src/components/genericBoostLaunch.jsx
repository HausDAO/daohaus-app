import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react';

const GenericBoostLaunch = ({
  handleLaunch,
  boostName,
  boostBody,
  boostInstructions,
  boostLink,
  boostCTA,
  loading,
  setLoading,
}) => {
  const { daochain, daoid } = useParams();
  const [step, setStep] = useState(1);

  const onSubmit = async () => {
    setLoading(true);

    const success = await handleLaunch({});
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
            {boostName || null}
          </Heading>
          <Text my={6}>{boostBody || null}</Text>

          <Button type='submit' disabled={loading} onClick={onSubmit}>
            Lets do it!
          </Button>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            {`${boostName || 'Boost'} unlocked`}
          </Heading>
          <Text my={6}>{boostInstructions || null}</Text>
          <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/${boostLink}`}>
            {boostCTA || "Let's go!"}
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default GenericBoostLaunch;
