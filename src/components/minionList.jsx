import React, { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Flex, Icon, useToast, HStack, Stack, Badge } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { VscGear } from 'react-icons/vsc';
import { FaCopy } from 'react-icons/fa';

import { useDao } from '../contexts/DaoContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { truncateAddr } from '../utils/general';
import { MINION_TYPES } from '../utils/proposalUtils';

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

  const getMinionData = minion => {
    if (!minion?.minionType) return 'minon';
    switch (minion.minionType) {
      case MINION_TYPES.SUPERFLUID:
        return {
          badgeColor: 'green',
          badgeTextColor: 'white',
          badgeName: 'SF',
          badgeVariant: 'solid',
          url: `/dao/${daochain}/${daoid}/settings/superfluid-minion/${minion.minionAddress}`,
        };
      case MINION_TYPES.UBER:
        return {
          badgeColor: 'purple',
          badgeTextColor: 'white',
          badgeName: 'UHS',
          badgeVariant: 'solid',
          url: `/dao/${daochain}/${daoid}/allies`,
        };
      case MINION_TYPES.NIFTY:
        return {
          badgeColor: 'orange',
          badgeTextColor: 'white',
          badgeName: 'NIFTY',
          badgeVariant: 'solid',
          url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
        };
      case MINION_TYPES.NEAPOLITAN:
        return {
          badgeColor: 'pink',
          badgeTextColor: '#632b16',
          badgeName: 'NEAPOLITAN',
          badgeVariant: 'outline',
          url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
        };
      default:
        return {
          badgeColor: 'white',
          badgeTextColor: 'black',
          badgeName: 'Vanilla',
          badgeVariant: 'solid',
          url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
        };
    }
  };

  const copiedToast = () => {
    toast({
      title: 'Copied Minion Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  console.log('minions', minions);

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
          } = getMinionData(minion);

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
