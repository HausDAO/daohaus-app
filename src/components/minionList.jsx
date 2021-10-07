import React, { useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { VscGear } from 'react-icons/vsc';
import { Flex, Icon, useToast, HStack, Stack, Badge } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { getVaultListData } from '../utils/vaults';
import { truncateAddr } from '../utils/general';

const MinionList = () => {
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const toast = useToast();
  const minions = useMemo(() => {
    if (daoOverview?.minions) {
      return daoOverview?.minions.sort((minionA, minionB) =>
        minionA.createdAt > minionB.createdAt ? 1 : -1,
      );
    }
  }, [daoOverview]);

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
        {minions.map(minion => {
          const {
            badgeColor,
            badgeTextColor,
            badgeName,
            badgeVariant,
            url,
          } = getVaultListData(minion, daochain, daoid);

          return (
            <Flex
              justify='space-between'
              align='center'
              key={minion.minionAddress}
            >
              <HStack spacing={2}>
                <TextBox color='secondary.500'>{minion.details}</TextBox>

                <TextBox
                  variant='value'
                  size='sm'
                  d={[
                    'none',
                    null,
                    null,
                    minion.details.length > 15 ? 'none' : 'inline-block',
                  ]}
                >
                  {truncateAddr(minion.minionAddress)}
                </TextBox>

                <Badge
                  variant={badgeVariant}
                  bg={badgeColor}
                  color={badgeTextColor}
                  borderColor='brown'
                >
                  {badgeName}
                </Badge>
              </HStack>

              <Flex align='center'>
                <CopyToClipboard
                  text={minion.minionAddress}
                  onCopy={copiedToast}
                  _hover={{
                    cursor: 'pointer',
                  }}
                  mr='1rem'
                >
                  <Icon as={FaCopy} color='primary.100' ml={2} />
                </CopyToClipboard>
                <RouterLink to={url}>
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
