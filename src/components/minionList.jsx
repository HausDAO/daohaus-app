import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Flex,
  Icon,
  useToast,
  HStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { VscGear } from 'react-icons/vsc';
import { FaCopy } from 'react-icons/fa';

import { useDao } from '../contexts/DaoContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { truncateAddr } from '../utils/general';

const MinionList = () => {
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const toast = useToast();

  const copiedToast = () => {
    toast({
      title: 'Copied Minion Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <ContentBox d='flex' flexDirection='column' position='relative'>
      <Stack spacing={3}>
        {daoOverview?.minions.map((minion) => {
          const minionType = useBreakpointValue({
            base: minion.minionType?.split(' ')[0],
            md: minion.minionType,
          });
          return (
            <Flex
              justify='space-between'
              align='center'
              key={minion.minionAddress}
            >
              <HStack spacing={2}>
                <TextBox size='xs' color='whiteAlpha.500'>
                  {`${minionType}:`}
                </TextBox>
                <TextBox color='secondary.500'>{minion.details}</TextBox>

                <TextBox
                  variant='value'
                  size='sm'
                  d={['none', null, null, 'inline-block']}
                >
                  {truncateAddr(minion.minionAddress)}
                </TextBox>

                <CopyToClipboard
                  text={minion.minionAddress}
                  onCopy={copiedToast}
                  _hover={{
                    cursor: 'pointer',
                  }}
                >
                  <Icon as={FaCopy} color='primary.100' ml={2} />
                </CopyToClipboard>
              </HStack>

              <Flex align='center'>
                <RouterLink
                  to={`/dao/${daochain}/${daoid}/settings/minion/${minion.minionAddress}`}
                >
                  <Icon
                    as={VscGear}
                    color='secondary.500'
                    w='25px'
                    h='25px'
                    mr={3}
                  />
                </RouterLink>
              </Flex>
            </Flex>
          );
        })}
      </Stack>
    </ContentBox>
  );
};

export default MinionList;
