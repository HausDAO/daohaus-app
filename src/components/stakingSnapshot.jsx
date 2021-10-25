import React, { useState } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

const StakingSnapshot = () => {
  const [view, setView] = useState('staked');

  const switchView = e => {
    if (e?.target?.value) {
      setView(e.target.value);
    }
  };

  return (
    <Flex>
      <ContentBox
        d='flex'
        minWidth={[null, null, null, '888px']}
        width='100%'
        maxWidth='1090px'
        mr='auto'
        flexDirection={['column', null, null, 'row']}
      >
        <Flex
          w='100%'
          flexDirection='column'
          borderRight={['none', null, null, '1px solid rgba(255,255,255,0.2)']}
          borderBottom={['1px solid rgba(255,255,255,0.2)', null, null, 'none']}
        >
          <Flex mb={6}>
            <Button
              size='sm'
              variant={view === 'staked' ? 'solid' : 'outline'}
              value='staked'
              onClick={switchView}
              borderRadius='6px 0 0 6px'
              _hover={{ scale: '1' }}
              outline='none'
            >
              Staked
            </Button>
            <Button
              size='sm'
              variant={view === 'rewards' ? 'solid' : 'outline'}
              value='rewards'
              onClick={switchView}
              borderRadius='0 6px 6px 0'
              _hover={{ scale: '1' }}
              outline='none'
            >
              Rewards
            </Button>
          </Flex>

          <Box
            fontSize='3xl'
            color='#ffffff'
            fontFamily='Space Mono'
            fontWeight={700}
          >
            26,054.26
          </Box>
          <TextBox size='xs' transform='translateY(2px)' mb={6}>
            Haus Staked
          </TextBox>
          <Box
            fontSize='3xl'
            color='#ffffff'
            fontFamily='Space Mono'
            fontWeight={700}
          >
            104
          </Box>
          <TextBox size='xs' transform='translateY(2px)' mr={2} mb={6}>
            Stakers
          </TextBox>
        </Flex>
        <Flex justifyContent='center' alignItems='center' width='100%'>
          Chart
        </Flex>
      </ContentBox>

      <Box
        width='100%'
        maxWidth='350px'
        minWidth='280px'
        ml={4}
        justifyContent='space-between'
        height='150px'
        display={['none', null, null, null, 'block']}
      />
    </Flex>
  );
};

export default StakingSnapshot;
