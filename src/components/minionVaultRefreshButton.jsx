import React, { useEffect, useState } from 'react';
import { IconButton } from '@chakra-ui/react';
import { RiRefreshLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';

const MinionVaultRefreshButton = () => {
  const { minion } = useParams();
  const { isMember } = useDaoMember();
  const { refreshMinionVault } = useDao();
  const { refreshDao } = useTX();
  const [hideRefresh, setHideRefresh] = useState(false);

  useEffect(() => {
    if (hideRefresh) {
      // hide the button after a refresh to support rate limiting/prevent overloading the lambda
      const interval = setInterval(() => {
        setHideRefresh(false);
      }, 600000);
      return () => clearInterval(interval);
    }
  }, [hideRefresh]);

  const handleRefreshMinion = async () => {
    console.log('refreshing');
    setHideRefresh(true);
    await refreshMinionVault(minion);
    console.log('vault refreshed');
    refreshDao();
  };

  if (!isMember || hideRefresh || !minion) {
    return null;
  }

  return (
    <IconButton
      icon={<RiRefreshLine size='1.5rem' />}
      p={0}
      size='sm'
      variant='outline'
      onClick={handleRefreshMinion}
    />
  );
};

export default MinionVaultRefreshButton;
