import React, { useState } from 'react';
import { Icon, Link } from '@chakra-ui/core';
import { RiArrowDownSLine } from 'react-icons/ri';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';

const ChangeDao = () => {
  const [showDaoSwitcher, setShowDaoSwitcher] = useState(false);
  return (
    <>
      <Link fontSize='xs' onClick={() => setShowDaoSwitcher(true)}>
        Change Dao
        <Icon as={RiArrowDownSLine} />
      </Link>

      <DaoSwitcherModal
        isOpen={showDaoSwitcher}
        setShowModal={setShowDaoSwitcher}
      />
    </>
  );
};

export default ChangeDao;
