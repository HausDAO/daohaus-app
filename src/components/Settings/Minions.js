import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Icon, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { VscGear } from 'react-icons/vsc';

import { useDao } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { truncateAddr } from '../../utils/helpers';
import { FaCopy } from 'react-icons/fa';

const Minions = () => {
  const [dao] = useDao();
  const toast = useToast();
  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      {dao?.graphData &&
        dao.graphData.minions.map((minion) => {
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
                >
                  <Icon as={FaCopy} color='secondary.300' ml={2} />
                </CopyToClipboard>
              </TextBox>
              <Flex align='center'>
                <RouterLink to={`/dao/${dao.address}/settings/minions`}>
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

export default Minions;
