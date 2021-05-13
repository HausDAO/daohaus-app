import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Text } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';
import { RiExternalLinkLine } from 'react-icons/ri';

import { supportedChains } from '../utils/chain';
import { useDao } from '../contexts/DaoContext';
import NewTransmutation from '../forms/newTransmutation';

const CcoTransmutation = ({ ccoType, transmutation }) => {
  const [vanillaMinion, setVanillaMinion] = useState(null);
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();

  useEffect(() => {
    const minion = daoOverview?.minions.find(
      minion => minion.minionType === 'vanilla minion',
    );

    setVanillaMinion(minion);
  }, [daoOverview]);

  return (
    <Box mb={10} pb={5} borderBottomWidth={1}>
      <Box fontSize='xl' mb={5}>
        Transmutation Contract
      </Box>

      {transmutation ? (
        <Box mb={5}>
          <Text
            fontFamily='mono'
            variant='value'
            fontSize='sm'
            as={Link}
            href={`${supportedChains[daochain].block_explorer}/address/${daoid}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <Flex color='secondary.400' align='center'>
              <Box>{transmutation.transmutation}</Box>
              <Icon as={RiExternalLinkLine} color='secondary.400' mx={2} />
            </Flex>
          </Text>
        </Box>
      ) : (
        <Box mb={5}>
          {!vanillaMinion ? (
            <RouterLink to={`/dao/${daochain}/${daoid}/settings/boosts`}>
              Launch a vanilla minion before transmutation contracts
            </RouterLink>
          ) : (
            <NewTransmutation
              ccoType={ccoType}
              ccoVanillaMinion={vanillaMinion}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default CcoTransmutation;
