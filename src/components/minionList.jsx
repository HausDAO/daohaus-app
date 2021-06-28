import React, { useCallback, useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Flex,
  Icon,
  useToast,
  HStack,
  Stack,
  useBreakpointValue,
  Badge,
} from '@chakra-ui/react';
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

  const getMinionData = useCallback(minionType => {
    if (!minionType) return 'minon';
    switch (minionType) {
      case MINION_TYPES.SUPERFLUID:
        return {
          minionUrlType: 'superfluid-minion',
          badgeColor: 'green',
          badgeTextColor: 'white',
          badgeName: 'SF',
        };
      case MINION_TYPES.UBER:
        return {
          minionUrlType: 'minion',
          badgeColor: 'purple',
          badgeTextColor: 'white',
          badgeName: 'UHS',
        };
      default:
        return {
          minionUrlType: 'minion',
          badgeColor: 'white',
          badgeTextColor: 'black',
          badgeName: 'Vanilla',
        };
    }
  }, []);

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
          const minionType = useBreakpointValue({
            base: minion.minionType?.split(' ')[0],
            md: minion.minionType,
          });

          const {
            minionUrlType,
            badgeColor,
            badgeTextColor,
            badgeName,
          } = getMinionData(minionType);

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

                <Badge variant='' bg={badgeColor} color={badgeTextColor}>
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
                <RouterLink
                  to={`/dao/${daochain}/${daoid}/settings/${minionUrlType}/${minion.minionAddress}`}
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
