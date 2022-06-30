import React from 'react';
import { Button, Flex, useTheme } from '@chakra-ui/react';

import { BiTachometer } from 'react-icons/bi';
import { ParaSm } from '../components/typography';
import { earlyExecuteMinionType, getExecuteAction } from '../utils/minionUtils';
import { MINION_TYPES } from '../utils/proposalUtils';
import { useTX } from '../contexts/TXContext';
import { useDao } from '../contexts/DaoContext';
import { ToolTipWrapper } from '../staticElements/wrappers';

export const ExecuteQuorum = ({ proposal, voteData }) => {
  const { totalYes } = voteData;
  const { submitTransaction } = useTX();
  const { daoOverview } = useDao();

  const theme = useTheme();
  const totalShares = daoOverview?.totalShares;
  const percYesVotes =
    totalShares && totalYes && ((totalYes / totalShares) * 100).toFixed();
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

  const Quorum = color => (
    <>
      <BiTachometer color={color} size='1.2rem' />
      <ParaSm ml={1}>
        {percYesVotes}/{proposal.minion.minQuorum}%
      </ParaSm>
    </>
  );

  if (!proposal?.minion?.minQuorum || !earlyExecuteMinionType(proposal))
    return null;
  if (hasReachedQuorum) {
    return !proposal.executed ? (
      <Button variant='ghost' size='fit-content' onClick={execute} p='0'>
        <Quorum color={theme?.colors?.secondary?.[500]} />
      </Button>
    ) : (
      <Quorum color={theme?.colors?.secondary?.[500]} />
    );
  }

  return (
    <Flex opacity='.6' cursor='not-allowed'>
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
          <Quorum color='white' />
        </Flex>
      </ToolTipWrapper>
    </Flex>
  );
};

export default ExecuteQuorum;
