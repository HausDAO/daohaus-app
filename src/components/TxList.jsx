import React from 'react';
import { Box, Text, Spinner, Flex, Icon, Stack } from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';

import { useUser } from '../contexts/UserContext';
import ExplorerLink from './explorerLink';

const TxList = ({ limit = 5 }) => {
  const { outstandingTXs } = useUser();
  //  before deciding on how data will be displayed here, I wanted to discuss all that we wanted
  //  from a TX list. Should we display unresolved before resolved. Should we also account for errors?
  //  We now have available to us all the information from the TX, so we have lots of other opportunities.
  //  as well.

  return (
    <Stack spacing={4}>
      {outstandingTXs?.slice(0, limit)?.map(tx => {
        return (
          <Box key={tx.txHash}>
            <Flex direction='row' justifyContent='start' alignItems='center'>
              {tx.status === 'unresolved' ? (
                <>
                  <Icon as={Spinner} name='check' color='white' mr={2} />
                  <Text color='white'>{tx?.unresolvedMsg}</Text>
                </>
              ) : (
                <>
                  <Icon
                    as={RiCheckboxCircleLine}
                    name='check'
                    color='green.500'
                    mr={2}
                  />
                  <Text color='white'>{tx?.resolvedMsg}</Text>
                </>
              )}
              <ExplorerLink
                chainID={tx?.pollArgs?.chainID}
                type='tx'
                hash={tx.txHash}
                isIconLink
              />
            </Flex>
          </Box>
        );
      })}
    </Stack>
  );
};

export default TxList;
