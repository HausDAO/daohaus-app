import React from 'react';
import { Icon, Link } from '@chakra-ui/react';
import { RiArrowDownSLine } from 'react-icons/ri';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';
import { useModals } from '../../contexts/PokemolContext';

const ChangeDao = () => {
  const { modals, openModal } = useModals();

  return (
    <>
      <Link fontSize='xs' onClick={() => openModal('changeDao')}>
        Change Dao
        <Icon as={RiArrowDownSLine} />
      </Link>

      <DaoSwitcherModal isOpen={modals.changeDao} />
    </>
  );
};

export default ChangeDao;
