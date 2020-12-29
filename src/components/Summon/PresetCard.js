import React from 'react';

import {
  formatPeriodDuration,
  formatPeriodLength,
  formatDepositWei,
} from '../../utils/helpers';

import { Box, Text, Heading } from '@chakra-ui/react';

const PresetCard = ({ preset, selectPreset, isSelected }) => {
  return (
    <Box
      className={isSelected ? 'PresetCard isSelected' : 'PresetCard'}
      key={preset.presetName}
      onClick={() => selectPreset(preset)}
    >
      <Box className='PresetCard__Inner'>
        <Box className='PresetCard__Front'>
          <img src={preset.img} alt='daohaus' />
          <Heading as='h4' style={{ color: preset.color }}>
            {preset.presetName}
          </Heading>
          <Heading as='h5' style={{ color: preset.color }}>
            {preset.presetSubtitle}
          </Heading>
          <Text>{preset.presetDescription}</Text>
        </Box>
        <Box className='PresetCard__Back'>
          <Heading as='h4' style={{ color: preset.color }}>
            {preset.presetName}
          </Heading>
          <Heading as='h5' style={{ color: preset.color }}>
            Default Settings
          </Heading>
          <Text>
            Currency: <strong>{preset.currency}</strong>
          </Text>
          <Text>
            Min Tribute:{' '}
            <strong>{`${preset.minimumTribute} ${preset.currency}`}</strong>
          </Text>
          <Text>
            Period Duration:{' '}
            <strong>{formatPeriodDuration(preset.periodDuration)}</strong>
          </Text>
          <Text>
            Voting Period:{' '}
            <strong>
              {formatPeriodLength(preset.votingPeriod, preset.periodDuration)}
            </strong>
          </Text>
          <Text>
            Grace Period:{' '}
            <strong>
              {formatPeriodLength(preset.gracePeriod, preset.periodDuration)}
            </strong>
          </Text>
          <Text>
            Prop Deposit:{' '}
            <strong>{`${formatDepositWei(preset.proposalDeposit)} ${
              preset.currency
            }`}</strong>
          </Text>
          <Text>
            Prop Reward:{' '}
            <strong>{`${formatDepositWei(preset.processingReward)} ${
              preset.currency
            }`}</strong>
          </Text>
          <Text>* You can change these later</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default PresetCard;
