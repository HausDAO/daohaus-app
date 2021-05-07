import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Icon, Button, Link, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { RiQuestionLine } from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';

import AddressAvatar from './addressAvatar';
import { numberWithCommas } from '../utils/general';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { SF_LABEL } from '../utils/toolTipLabels';

export const cancelButtonTooltip = stream => {
  if (stream.active && !stream.liquidated) return SF_LABEL.GUILDKICK;
  if (stream.liquidated) return SF_LABEL.LIQUIDATED;
  if (!stream.executed) return SF_LABEL.PROPOSAL;
  return '';
};

const StreamListItem = ({
  stream,
  balances,
  cancelStream,
  loading,
  daoMember,
  network,
}) => {
  const { daoid, daochain } = useParams();
  const handleCancelStream = () => {
    const isActive = stream?.active || stream?.executed;
    cancelStream(stream.proposalId, isActive);
  };

  return (
    <Flex h='60px' align='center'>
      <Box w='15%' d={['none', null, null, 'inline-block']} fontFamily='mono'>
        {stream?.createdAt
          ? format(new Date(+stream?.createdAt * 1000), 'MMM. d, yyyy')
          : '--'}
      </Box>
      <Box w='33%'>
        <AddressAvatar addr={stream.to} hideCopy alwaysShowName />
      </Box>
      <Box w='15%' fontFamily='mono'>
        {stream?.rateStr
          ? `${stream.rateStr}`
          : `${numberWithCommas(
              parseFloat(
                +stream.rate /
                  10 ** balances[stream.superTokenAddress].decimals,
              ).toFixed(10),
            )} per sec`}
      </Box>
      <Box w='15%'>
        {stream?.executed ? (
          <Box fontFamily='mono'>
            {balances[stream.superTokenAddress] && (
              <>
                {stream.netFlow.toFixed(4)}{' '}
                {balances[stream.superTokenAddress].symbol}
              </>
            )}
          </Box>
        ) : (
          <Box fontFamily='mono'>
            <Text fontFamily='mono'>Not started</Text>
          </Box>
        )}
      </Box>
      <Stack direction='row' spacing={4}>
        {daoMember && (
          <ToolTipWrapper
            placement='right'
            tooltip
            tooltipText={cancelButtonTooltip(stream)}
          >
            <Button
              rightIcon={<RiQuestionLine />}
              variant='solid'
              onClick={handleCancelStream}
              loadingText={!stream.executed ? 'Cancelling' : 'Stoppping'}
              isLoading={
                loading.active && loading.condition === stream.proposalId
              }
              disabled={
                !daoMember ||
                (stream.executed && !stream.active) ||
                (loading.active && loading.condition === stream.proposalId)
              }
            >
              Cancel
            </Button>
          </ToolTipWrapper>
        )}
        <Link
          as={!stream.executed && RouterLink}
          to={
            !stream.executed
              ? `/dao/${daochain}/${daoid}/proposals/${stream.proposalId}`
              : null
          }
          href={
            stream.executed &&
            `https://app.superfluid.finance/streams/${network}/${stream.execTxHash}`
          }
          isExternal={stream.executed}
        >
          <Button leftIcon={<Icon as={VscLinkExternal} />} variant='outline'>
            View
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
};

export default StreamListItem;
