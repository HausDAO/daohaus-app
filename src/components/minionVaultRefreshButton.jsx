import React, { useState } from 'react';
import { RiRefreshLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import { IconButton, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useTX } from '../contexts/TXContext';

const MinionVaultRefreshButton = () => {
  const { minion } = useParams();
  const { isMember } = useDaoMember();
  const { refreshMinionVault } = useDao();
  const { refreshDao } = useTX();
  const [loading, setLoading] = useState(false);

  const handleRefreshMinion = async () => {
    setLoading(true);
    await refreshMinionVault(minion);
    refreshDao();
    setLoading(false);
  };

  if (loading) {
    return <Spinner size='md' color='secondary.400' />;
  }

  if (!isMember || !minion) {
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
