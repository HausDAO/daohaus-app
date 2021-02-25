import React, { useEffect, useState } from 'react';
import { Box, Flex, Link, Progress, Button, Spinner } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { countDownText } from '../utils/cco';
import { getEligibility } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const CcoContribution = React.memo(function ccocontribution({
  daoMetaData,
  currentDaoTokens,
}) {
  const { address } = useInjectedProvider();
  const [roundData, setRoundData] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    if (currentDaoTokens && daoMetaData?.boosts?.cco?.active) {
      const ccoToken = currentDaoTokens.find(
        (token) =>
          token.tokenAddress === daoMetaData.boosts.cco.metadata.tributeToken,
      );

      const round = daoMetaData.boosts.cco.metadata.rounds.find(
        // TODO: make this dynamic based on start times and now time
        // const now = new Date() / 1000;
        (round) => round.round === 1,
      );

      const currentRound = {
        ...round,
        endTime: `${+round.startTime + +round.duration}`,
      };

      setRoundData({ ccoToken, currentRound });
    }
  }, [currentDaoTokens, daoMetaData]);
  console.log('ccoToken', roundData);

  const checkEligibility = async () => {
    setCheckingEligibility(true);
    const eligibleRes = await getEligibility(address);
    setIsEligible(eligibleRes);
    setCheckingEligibility(false);
  };

  return (
    <MainViewLayout header='DAOhaus CCO' isDao={true}>
      <Box w='100%'>
        <Flex wrap='wrap'>
          {roundData ? (
            <>
              <Box
                w={['100%', null, null, null, '50%']}
                pr={[0, null, null, null, 6]}
                mb={6}
              >
                <ContentBox mt={2} w='100%'>
                  <TextBox size='sm' color='whiteAlpha.900' mb={7}>
                    1. Check eligibility
                  </TextBox>
                  {isEligible ? (
                    <TextBox variant='value' size='xl' my={2}>
                      You are eligible!
                    </TextBox>
                  ) : (
                    <Button
                      onClick={checkEligibility}
                      disabled={checkingEligibility}
                    >
                      {!checkingEligibility ? (
                        <>Check Eligibility</>
                      ) : (
                        <Spinner />
                      )}
                    </Button>
                  )}
                </ContentBox>

                <ContentBox mt={2} w='100%'>
                  <TextBox size='sm' color='whiteAlpha.900'>
                    2. Contribute
                  </TextBox>
                </ContentBox>

                <ContentBox mt={2} w='100%'>
                  <TextBox size='sm' color='whiteAlpha.900'>
                    3. Claim
                  </TextBox>
                </ContentBox>
              </Box>
              <Box w={['100%', null, null, null, '50%']}>
                <ContentBox mt={2} w='100%'>
                  <Box
                    fontSize='xl'
                    fontWeight={700}
                    fontFamily='heading'
                    mb={7}
                  >
                    Status
                  </Box>
                  <Progress
                    colorScheme='secondary'
                    height='24px'
                    value={20}
                    mb={7}
                  />
                  <Flex direction='row' justifyContent='space-between'>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Min target
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${roundData.currentRound.minTarget} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Max target
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${roundData.currentRound.maxTarget} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                  </Flex>
                  <Flex direction='row' justifyContent='space-between' mb={5}>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Contributed
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`1 ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Room Left
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`4 ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                  </Flex>
                  <TextBox size='sm' color='whiteAlpha.900'>
                    {/* Round closes in 3 days
                     */}
                    {countDownText(roundData.currentRound)}
                  </TextBox>
                </ContentBox>
                <ContentBox mt={2} w='100%'>
                  <Box
                    fontSize='xl'
                    fontWeight={700}
                    fontFamily='heading'
                    mb={7}
                  >
                    Resources
                  </Box>

                  <Link
                    href='https://daohaus.club/ '
                    isExternal
                    display='flex'
                    alignItems='center'
                    mb={5}
                  >
                    <TextBox fontSize='sm' colorScheme='secondary.500'>
                      About DAOhaus
                    </TextBox>
                  </Link>

                  <Link
                    href='https://daohaus.club/ '
                    isExternal
                    display='flex'
                    alignItems='center'
                  >
                    <TextBox fontSize='sm' colorScheme='secondary.500'>
                      About CCOs
                    </TextBox>
                  </Link>
                </ContentBox>
              </Box>
            </>
          ) : (
            <Box>DAO does not have an active CCO</Box>
          )}
        </Flex>
      </Box>
    </MainViewLayout>
  );
});

export default CcoContribution;
