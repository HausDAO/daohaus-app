import React, { useState, useContext, useEffect } from 'react';

import { daoConstants } from '../../content/summon-presets';
import { SummonContext } from '../../contexts/SummonContext';
import SummonStepOne from '../../components/Summon/SummonStepOne';
import HardModeForm from '../../components/Summon/HardModeForm';
import SummonStepTwo from '../../components/Summon/SummonStepTwo';
import SummonStepThree from '../../components/Summon/SummonStepThree';
import { useUser } from '../../contexts/PokemolContext';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
// import BoostPackages from '../../components/Boosts/BoostPackages';
// import MiniLoader from '../../components/Shared/Loading/MiniLoader';

const Summon = () => {
  const [user] = useUser();
  const [hardMode, setHardMode] = useState(false);
  const [daoData, setDaoData] = useState(daoConstants());
  const [isSummoning, setIsSummoning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { state, dispatch } = useContext(SummonContext);

  // use network to init service

  const stepContent = {
    1: 'What kind of Haus will you build?',
    2: 'Give us the basics',
    3: 'Last chance to make changes',
    4: 'Our magic internet communities take a minute or two to create.',
  };

  const handleSummon = async (data) => {
    setCurrentStep(4);
    setIsSummoning(true);

    setDaoData((prevState) => {
      return {
        ...prevState,
        ...data,
        summon: true,
      };
    });
  };

  useEffect(() => {
    const summonDao = async () => {
      console.log('summoning HERE', daoData);
      await state.service.summonDao(daoData, user.userusername, dispatch);
    };

    if (daoData.summon) {
      summonDao();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoData]);

  useEffect(() => {
    if (state.status === 'error') {
      setIsSummoning(false);
      setCurrentStep(3);
    }

    if (state.status === 'complete') {
      dispatch({ type: 'clearState' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      {user && user.username ? (
        <Box>
          <Box className='Summon__hero'>
            <Heading as='h1'>SUMMON</Heading>
          </Box>

          <Box className='View Summon'>
            <Box className='Row'>
              <Box className='Summon__step'>
                {currentStep > 4 ? (
                  <Heading as='h3'>Step {currentStep}</Heading>
                ) : null}
                <Text>{stepContent[currentStep]}</Text>
              </Box>
              {currentStep > 4 ? <button>Get Help</button> : null}
            </Box>

            {state.status === 'error' ? (
              <Heading as='h1'>
                {state.errorMessage.message || state.errorMessage}
              </Heading>
            ) : null}

            {!isSummoning ? (
              <>
                {!hardMode ? (
                  <>
                    {currentStep === 1 ? (
                      <SummonStepOne
                        daoData={daoData}
                        setDaoData={setDaoData}
                        setCurrentStep={setCurrentStep}
                      />
                    ) : null}

                    {currentStep === 2 ? (
                      <SummonStepTwo
                        daoData={daoData}
                        setDaoData={setDaoData}
                        setCurrentStep={setCurrentStep}
                      />
                    ) : null}

                    {currentStep === 3 ? (
                      <SummonStepThree
                        daoData={daoData}
                        setDaoData={setDaoData}
                        setCurrentStep={setCurrentStep}
                        handleSummon={handleSummon}
                      />
                    ) : null}

                    {currentStep === 1 ? (
                      <Box className='ModeSwitch'>
                        <Text style={{ width: '100%', textAlign: 'center' }}>
                          I&apos;m a DAO master, take me to{' '}
                          <Button
                            className='mode-link'
                            onClick={() => setHardMode(true)}
                          >
                            Hard Mode
                          </Button>
                        </Text>
                      </Box>
                    ) : null}
                  </>
                ) : (
                  <>
                    <HardModeForm
                      daoData={daoData}
                      setDaoData={setDaoData}
                      handleSummon={handleSummon}
                    />
                    <Box className='ModeSwitch'>
                      <Text style={{ width: '100%', textAlign: 'center' }}>
                        Take me back to{' '}
                        <Button
                          className='mode-link'
                          onClick={() => setHardMode(false)}
                        >
                          Fun Mode.
                        </Button>
                      </Text>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                Loading
                {/* <MiniLoader txHash={state.summonTx} />
                <Text>While you wait, check out our boosts</Text>
                <BoostPackages isSummoning={isSummoning} /> */}
              </>
            )}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Summon;
