import React from 'react';
import { Button, Flex, Tooltip, useTheme } from '@chakra-ui/react';

import { BiTachometer } from 'react-icons/bi';
import { ParaSm } from '../components/typography';
import { earlyExecuteMinionType, getExecuteAction } from '../utils/minionUtils';
import { MINION_TYPES } from '../utils/proposalUtils';
import { useTX } from '../contexts/TXContext';
import { ToolTipWrapper } from '../staticElements/wrappers';

export const ExecuteQuorum = ({ proposal, voteData }) => {
  const { totalVotes, totalYes } = voteData;
  const { submitTransaction } = useTX();

  const theme = useTheme();
  const percYesVotes =
    totalVotes && totalYes && ((totalYes / totalVotes) * 100).toFixed();
  const hasReachedQuorum = percYesVotes >= Number(proposal?.minion?.minQuorum);

  const execute = async () => {
    const { minionAddress, proposalId, proposalType, minion } = proposal;
    await submitTransaction({
      tx: getExecuteAction({ minion }),
      args:
        minion.minionType === MINION_TYPES.SAFE
          ? [proposal.proposalId, proposal.actions[0].data]
          : [proposal.proposalId],
      localValues: {
        minionAddress,
        proposalId,
        proposalType,
      },
    });
  };

  if (!proposal?.minion?.minQuorum || !earlyExecuteMinionType(proposal))
    return null;
  if (hasReachedQuorum && !proposal.executed) {
    return (
      <Flex position='absolute' right='0' alignItems='center'>
        <ToolTipWrapper
          tooltip
          placement='right'
          tooltipText={{
            title: 'Can execute',
            pars: [
              `This proposal requires ${proposal?.minion?.minQuorum}% of DAO shares to vote 'Yes' in order to execute the minion transaction early`,
            ],
          }}
        >
          <Button variant='ghost' size='fit-content' onClick={execute}>
            <BiTachometer
              color={theme?.colors?.secondary?.[500]}
              size='1.2rem'
            />
            <ParaSm ml={1}>
              {percYesVotes}/{proposal.minion.minQuorum}%
            </ParaSm>
          </Button>
        </ToolTipWrapper>
      </Flex>
    );
  }

  return (
    <Flex
      position='absolute'
      top='0'
      right='0'
      opacity='.6'
      cursor='not-allowed'
    >
      <ToolTipWrapper
        tooltip
        placement='right'
        tooltipText={{
          title: 'Quorum not met',
          pars: [
            `This proposal requires ${proposal?.minion?.minQuorum}% of DAO shares to vote 'Yes' in order to execute the minion transaction early`,
          ],
        }}
      >
        <Flex alignItems='center'>
          <BiTachometer color='white' size='1.2rem' />
          <ParaSm ml={1}>
            {percYesVotes}/{proposal.minion.minQuorum}%
          </ParaSm>
        </Flex>
      </ToolTipWrapper>
    </Flex>
  );
};

export default ExecuteQuorum;
