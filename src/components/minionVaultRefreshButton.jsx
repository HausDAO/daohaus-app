import React, { useEffect, useState } from 'react';
import { RiRefreshLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { Box, IconButton, Spinner } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useTX } from '../contexts/TXContext';

const MinionVaultRefreshButton = () => {
  const { minion } = useParams();
  const { isMember } = useDaoMember();
  const { refreshDao } = useTX();
  const [hideRefresh, setHideRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setHideRefresh(true);
    await refreshDao();
    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }
  if (hideRefresh) {
    return <Box fontSize='xs'>Balances will update soon</Box>;
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
