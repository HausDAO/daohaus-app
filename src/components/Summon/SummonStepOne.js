import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

import { daoPresets } from '../../content/summon-presets';
import PresetCard from './PresetCard';
import { useNetwork } from '../../contexts/PokemolContext';

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
    <Box className='SummonStepOne'>
      <Text className='Alert'>
        Transaction fees got you down? Check our{' '}
        <a href='/help#xDAI'>Quick Start Guide</a> on how to switch to xDAI for
        cheaper, faster interactions for your community.
      </Text>
      <Box className='SummonStepOne__list'>{renderPresets()}</Box>
      <Box className='StepControl'>
        <Button
          onClick={() => setCurrentStep(2)}
          disabled={!daoData.presetName}
          className={!daoData.presetName ? 'disabled' : ''}
        >
          Continue [arrow icon]
        </Button>
      </Box>
    </Box>
  );
};

export default SummonStepOne;
