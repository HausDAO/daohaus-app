import React, { useState } from 'react';
import { Icon, Link } from '@chakra-ui/core';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';

const ChangeDao = () => {
  const [showDaoSwitcher, setShowDaoSwitcher] = useState(false);
  return (
    <>
      <Link fontSize='xs' onClick={() => setShowDaoSwitcher(true)}>
        Change Dao
        <Icon name='chevron-down' />
      </Link>

      <DaoSwitcherModal
        isOpen={showDaoSwitcher}
        setShowModal={setShowDaoSwitcher}
      />
    </>
  );
};

export default ChangeDao;
