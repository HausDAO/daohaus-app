import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Flex, Icon, useToast } from '@chakra-ui/react';
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
  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      {daoOverview?.minions.map((minion) => {
        return (
          <Flex
            p={4}
            justify='space-between'
            align='center'
            key={minion.minionAddress}
          >
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              {minion.minionType}: {minion.details}{' '}
              {truncateAddr(minion.minionAddress)}
              <CopyToClipboard
                text={minion.minionAddress}
                onCopy={() =>
                  toast({
                    title: 'Copied Minion Address',
                    position: 'top-right',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }
                _hover={{
                  cursor: 'pointer',
                }}
              >
                <Icon as={FaCopy} color='secondary.300' ml={2} />
              </CopyToClipboard>
            </TextBox>
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
    </ContentBox>
  );
};

export default MinionList;
