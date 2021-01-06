import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Heading, Icon, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useDao } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { truncateAddr } from '../../utils/helpers';
import { FaCopy } from 'react-icons/fa';
import { useEffect } from 'react/cjs/react.development';

const Minions = () => {
  const [dao] = useDao();
  const toast = useToast();
  const { minion } = useParams();
  const [minionData, setMinionData] = useState();
  console.log('minion', minion);

  useEffect(() => {
    console.log('*****', dao.graphData?.minions);
    if (!dao.graphData?.minions.length) {
      return;
    }
    const _minionData = dao.graphData.minions.find((m) => {
      return m.minionAddress === minion;
    });
    setMinionData(_minionData);
    console.log('MINIONDATA', _minionData);
  }, [dao.graphData, minion]);
  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      {minionData && (
        <>
          <Flex
            p={4}
            justify='space-between'
            align='center'
            key={minionData.minionAddress}
          >
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              {minionData.minionType}: {minionData.details}{' '}
              {truncateAddr(minionData.minionAddress)}
              <CopyToClipboard
                text={minionData.minionAddress}
                onCopy={() =>
                  toast({
                    title: 'Copied Minion Address',
                    position: 'top-right',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }
              >
                <Icon as={FaCopy} color='secondary.300' ml={2} />
              </CopyToClipboard>
            </TextBox>
          </Flex>
          <Box>
            <Heading as='h3'>Balances</Heading>
            <Heading as='h3'>Deposit/withdraw/dao withdraw</Heading>
            <Heading as='h3'>New Prop/ Forged Prop</Heading>
            <Heading as='h3'>Proposals</Heading>
          </Box>
        </>
      )}
    </ContentBox>
  );
};

export default Minions;
