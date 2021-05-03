import React from 'react';
import { Box, Flex, Button, useBreakpointValue, Icon } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { useParams } from 'react-router';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
// import StakingSnapshot from '../components/stakingSnapshot';
import ClanCard from '../components/clanCard';
import RonanCard from '../components/ronanCard';
import ShogunCard from '../components/shogunCard';

import { useOverlay } from '../contexts/OverlayContext';
import MainViewLayout from '../components/mainViewLayout';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const Staking = () => {
  const { daoid } = useParams();
  const isUberHaus = daoid === UBERHAUS_DATA.ADDRESS;

  const onStakeHaus = () => {};

  const StakeHausBtn = () => (
    <Button textTransform='uppercase' onClick={onStakeHaus}>
      stake $haus
    </Button>
  );

  if (!isUberHaus) {
    return null;
  }

  return (
    <MainViewLayout header='Stake' headerEl={<StakeHausBtn />} isDao>
      <Box>
        <TextBox size='sm' mb={3} textTransform='uppercase'>
          stake $haus, earn $haus
        </TextBox>
        <Flex
          align='start'
          justify='space-between'
          flexDir={['column', null, null, null, 'row']}
        >
          <Flex
            minWidth={[null, null, null, '888px']}
            width='100%'
            maxWidth='1090px'
            justifyContent={['space-around', null, null, 'flex-start']}
            mb={4}
            wrap={['wrap', null, null, 'nowrap']}
          >
            <ClanCard />
            <RonanCard />
            <ShogunCard />
          </Flex>
          <PriceBox />
        </Flex>
        {/* <TextBox size='sm' mb={3} textTransform='uppercase'>
          staking snapshot
        </TextBox> */}
      </Box>
      {/* <StakingSnapshot /> */}
    </MainViewLayout>
  );
};

export default Staking;

const PriceBox = () => {
  const { successToast } = useOverlay();

  const handleCopy = () =>
    successToast({
      title: 'Copied Address',
    });

  const WideBox = () => (
    <ContentBox d='flex' width='100%' justifyContent='space-around' mb={6}>
      <Flex alignItems='center' width='100%'>
        <TextBox size='xs' mr={3} transform='translateY(2px)'>
          Symbol:
        </TextBox>
        <Flex fontFamily='mono' fontSize='lg' fontWeight={700}>
          HAUS
          <CopyToClipboard
            text={UBERHAUS_DATA.STAKING_TOKEN}
            onCopy={handleCopy}
            ml={4}
          >
            <Icon as={FaCopy} _hover={{ cursor: 'pointer' }} />
          </CopyToClipboard>
        </Flex>
      </Flex>
      <Flex alignItems='center'>
        <TextBox size='xs' mr={2} transform='translateY(2px)'>
          Price:
        </TextBox>
        <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
          TBD
        </Box>
      </Flex>
    </ContentBox>
  );

  const ShortBox = () => (
    <ContentBox
      d='flex'
      width='100%'
      maxWidth='350px'
      minWidth='250px'
      ml={4}
      justifyContent='space-between'
      height='150px'
    >
      <Flex flexDirection='column'>
        <TextBox size='xs' mb='4'>
          Symbol:
        </TextBox>
        <Flex fontFamily='mono' fontSize='lg' fontWeight={700}>
          HAUS
          <CopyToClipboard
            text={UBERHAUS_DATA.STAKING_TOKEN}
            onCopy={handleCopy}
            ml={4}
          >
            <Icon as={FaCopy} _hover={{ cursor: 'pointer' }} />
          </CopyToClipboard>
        </Flex>
      </Flex>
      <Flex flexDirection='column' alignItems='flex-end'>
        <TextBox size='xs' mb='4'>
          Price:
        </TextBox>
        <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
          TBD
        </Box>
      </Flex>
    </ContentBox>
  );

  const variant = useBreakpointValue({ xl: <ShortBox />, base: <WideBox /> });

  return <>{variant}</>;
};
