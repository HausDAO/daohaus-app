import React from 'react';
import { Box, Text, Button, Flex, Link } from '@chakra-ui/react';
import { RiArrowRightFill } from 'react-icons/ri';
import { daoPresets } from '../../content/summon-presets';
import PresetCard from './PresetCard';
import { useNetwork } from '../../contexts/PokemolContext';

import {
  formatPeriodDuration,
  formatPeriodLength,
  formatDepositWei,
} from '../../utils/helpers';

const SummonSettings = ({ daoData, setDaoData, setCurrentStep }) => {
  const [network] = useNetwork();
  const selectPreset = (preset) => {
    setDaoData((prevState) => {
      return { ...prevState, ...preset };
    });
  };

  const renderPresets = () => {
    return daoPresets(network.network_id).map((preset) => {
      const isSelected = daoData.presetName === preset.presetName;
      return (
        <PresetCard
          preset={preset}
          isSelected={isSelected}
          selectPreset={selectPreset}
          key={preset.presetName}
        ></PresetCard>
      );
    });
  };

  const handleReset = () => {
    console.log('reset');
  };

  return (
    <Box>
      <Box
        d='flex'
        wrap='wrap'
        p='0px'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        borderRadius={5}
      >
        <Flex direction='column' w={['100%', null, null, null, '30%']}>
          {renderPresets()}
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '70%']}
          borderLeftWidth='1px'
          borderColor='whiteAlpha.200'
        >
          {daoData?.currency ? (
            <Box mt={4} p={6}>
              <Flex direction='row' justify='space-between'>
                <Text
                  as='h2'
                  fontFamily='heading'
                  fontSize='2xl'
                  style={{ color: daoData.color }}
                >
                  Settings
                </Text>
                <Button variant='outline' onClick={() => handleReset(true)}>
                  Reset to Default
                </Button>
              </Flex>
              <Text>{daoData.presetDescription}</Text>

              <Text>
                Currency: <strong>{daoData.currency}</strong>
              </Text>
              <Text>
                Period Duration:{' '}
                <strong>{formatPeriodDuration(daoData.periodDuration)}</strong>
              </Text>
              <Text>
                Voting Period:{' '}
                <strong>
                  {formatPeriodLength(
                    daoData.votingPeriod,
                    daoData.periodDuration,
                  )}
                </strong>
              </Text>
              <Text>
                Grace Period:{' '}
                <strong>
                  {formatPeriodLength(
                    daoData.gracePeriod,
                    daoData.periodDuration,
                  )}
                </strong>
              </Text>
              <Text>
                Prop Deposit:{' '}
                <strong>{`${formatDepositWei(daoData.proposalDeposit)} ${
                  daoData.currency
                }`}</strong>
              </Text>
              <Text>
                Prop Reward:{' '}
                <strong>{`${formatDepositWei(daoData.processingReward)} ${
                  daoData.currency
                }`}</strong>
              </Text>
              <Box className='StepControl'>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!daoData.presetName}
                  className={!daoData.presetName ? 'disabled' : ''}
                >
                  Continue <RiArrowRightFill />
                </Button>
              </Box>
            </Box>
          ) : (
            <Box p={6}>Select a preset</Box>
          )}
        </Flex>
      </Box>

      {network.network === 'kovan' ? (
        <Text mt={10}>
          Transaction fees got you down? Check our{' '}
          <Link to='https://daohaus.club/help#xDAI'>Quick Start Guide</Link> on
          how to switch to xDAI for cheaper, faster interactions for your
          community.
        </Text>
      ) : null}
    </Box>
  );
};

export default SummonSettings;
