import React from 'react';
import { RiQuestionLine } from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';
import { Flex, Box, Icon, Button, Link, Stack } from '@chakra-ui/react';
import { format } from 'date-fns';

import AddressAvatar from './addressAvatar';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { numberWithCommas } from '../utils/general';
import { SF_LABEL } from '../utils/toolTipLabels';

const StreamListItemV2 = ({
  stream,
  balances,
  cancelStream,
  loading,
  daoMember,
  network,
}) => {
  const rate = stream.flowUpdatedEvents.find(e => e.type === 0).flowRate;
  const streamRate = balances[stream.token.id]
    ? numberWithCommas(
        parseFloat(
          Number(rate) / 10 ** balances[stream.token.id].decimals,
        ).toFixed(10),
      )
    : '--';

  return (
    <Flex h='60px' align='center'>
      <Box w='15%' d={['none', null, null, 'inline-block']} fontFamily='mono'>
        {stream?.createdAtTimestamp
          ? format(
              new Date(Number(stream.createdAtTimestamp) * 1000),
              'MMM. d, yyyy',
            )
          : '--'}
      </Box>
      <Box w='33%'>
        <AddressAvatar addr={stream.receiver.id} hideCopy alwaysShowName />
      </Box>
      <Box w='15%' fontFamily='mono'>
        {`${streamRate} per sec`}
      </Box>
      <Box w='15%'>
        <Box fontFamily='mono'>
          {balances[stream.token.id] && (
            <>
              {stream?.netFlow?.toFixed(4)} {balances[stream.token.id].symbol}
            </>
          )}
        </Box>
      </Box>
      <Stack direction='row' spacing={4}>
        {daoMember && (
          <ToolTipWrapper
            placement='right'
            tooltip
            tooltipText={stream.active && SF_LABEL.CANCEL_STREAM}
          >
            <Button
              rightIcon={<RiQuestionLine />}
              variant='solid'
              onClick={() => cancelStream(stream)}
              isLoading={loading.active && loading.condition === stream.id}
              disabled={
                !daoMember ||
                !stream.active ||
                (loading.active && loading.condition === stream.id)
              }
            >
              Cancel
            </Button>
          </ToolTipWrapper>
        )}
        <Link
          href={`https://app.superfluid.finance/streams/${network}/${stream.createdTxHash}/${stream.createdIdx}/v1`}
          isExternal
        >
          <Button leftIcon={<Icon as={VscLinkExternal} />} variant='outline'>
            View
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
};

export default StreamListItemV2;
