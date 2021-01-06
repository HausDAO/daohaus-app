import React from 'react';

import { Box, Flex, Text, Heading } from '@chakra-ui/react';

const PresetCard = ({ preset, selectPreset, isSelected }) => {
  return (
    <Flex
      key={preset.presetName}
      onClick={() => selectPreset(preset)}
      cursor='pointer'
      borderColor='whiteAlpha.200'
      py={5}
      px={5}
      borderBottomWidth='1px'
      style={{
        background: isSelected ? preset.color : 'transparent',
      }}
      _hover={{
        background: isSelected ? preset.color : 'transparent',
      }}
      _first={{ borderTopLeftRadius: 6 }}
      _last={{ borderBottomLeftRadius: 6, borderBottomWidth: '0px' }}
    >
      <Box>
        <Heading
          as='h4'
          size='sm'
          style={{ color: isSelected ? 'white' : preset.color }}
        >
          {preset.presetName}
        </Heading>
        <Text>{preset.presetDescription}</Text>
      </Box>
    </Flex>
  );
};

export default PresetCard;
