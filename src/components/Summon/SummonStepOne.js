import React from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { RiArrowRightFill } from 'react-icons/ri';
import { daoPresets } from '../../content/summon-presets';
import PresetCard from './PresetCard';
import { useNetwork } from '../../contexts/PokemolContext';
import TextBox from '../Shared/TextBox';

import {
  formatPeriodDuration,
  formatPeriodLength,
  formatDepositWei,
} from '../../utils/helpers';

const SummonStepOne = ({ daoData, setDaoData, setCurrentStep }) => {
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
  return (
    <Box>
      <Text className='Alert'>
        Transaction fees got you down? Check our{' '}
        <a href='/help#xDAI'>Quick Start Guide</a> on how to switch to xDAI for
        cheaper, faster interactions for your community.
      </Text>
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
              <Text
                as='h2'
                fontFamily='heading'
                fontSize='2xl'
                style={{ color: daoData.color }}
              >
                {daoData.presetName}
              </Text>
              <Text>{daoData.presetDescription}</Text>
              <TextBox mt={4}>Settings</TextBox>
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
    </Box>
  );
};

export default SummonStepOne;
