import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ExecuteSafeMinion from './executeSafeMinion';
import { ParaSm } from '../components/typography';

const ExecuteMinionBuyout = props => {
  const { proposal } = props;
  const { daoMembers } = useDao();
  const { address } = useInjectedProvider();

  const isMember = useMemo(() => {
    if (address && daoMembers) {
      return daoMembers.find(
        member => member.memberAddress === address && Number(member.shares) > 0,
      );
    }
    return null;
  }, [address, daoMembers]);

  const memberApplicant = useMemo(() => {
    if (daoMembers) {
      const memberMatch = daoMembers.find(
        member => member.memberAddress === proposal.createdBy,
      );
      return {
        ...memberMatch,
        canExecute: memberMatch.loot === '0' && memberMatch.shares === '0',
      };
    }
    return null;
  }, [daoMembers]);

  if (!isMember) {
    return (
      <Box>
        <ParaSm mt={2}>Members can execute this proposal</ParaSm>
      </Box>
    );
  }

  if (!memberApplicant.canExecute) {
    return (
      <Box>
        <ParaSm mt={2}>
          Proposer must rage quit before this proposal can be executed
        </ParaSm>
      </Box>
    );
  }

  return (
    <ExecuteSafeMinion
      {...props}
      disabledOverride={!isMember || !memberApplicant.canExecute}
    />
  );
};

export default ExecuteMinionBuyout;
