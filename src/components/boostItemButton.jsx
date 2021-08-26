import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import TextBox from './TextBox';

const BoostItemButton = ({
  boost,
  openDetails,
  installBoost,
  goToSettings,
}) => {
  const cost = boost?.cost?.toUpperCase();
  if (!boost.isAvailable) {
    const handleClick = () => openDetails(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick}>
          <TextBox color='secondary.500'>Details</TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          size='sm'
          fontStyle='italic'
        >
          Unavailable on network - {cost}
        </TextBox>
      </Flex>
    );
  }
  if (!boost.isInstalled) {
    const handleClick = () => installBoost(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' onClick={handleClick} p={0}>
          <TextBox color='secondary.500'>Install</TextBox>
        </Button>
        <TextBox variant='body' mt={3} opacity='0.8' size='sm'>
          {cost}
        </TextBox>
      </Flex>
    );
  }
  if (boost.isInstalled) {
    const handleClick = () => {
      if (boost.settings === 'none') {
        openDetails(boost);
      } else {
        goToSettings(boost);
      }
    };
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick} color='red'>
          <TextBox color='secondary.500'>
            {boost.settings === 'none' ? 'Details' : 'Settings'}
          </TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          fontStyle='italic'
          size='sm'
        >
          installed
        </TextBox>
      </Flex>
    );
  }
  return null;
};

export default BoostItemButton;
