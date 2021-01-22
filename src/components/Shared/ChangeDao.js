import React from 'react';
import { IconButton, Link, Tooltip } from '@chakra-ui/react';
import { RiMenu3Line } from 'react-icons/ri';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';
import { useModals } from '../../contexts/PokemolContext';

const ChangeDao = () => {
  const { modals, openModal } = useModals();

  return (
    <>
      <Tooltip
        label='Change DAO'
        aria-label='Change DAO'
        placement='right'
        hasArrow
      >
        <IconButton
          icon={<RiMenu3Line />}
          size='lg'
          variant='ghost'
          isRound='true'
          as={Link}
          onClick={() => openModal('changeDao')}
        />
      </Tooltip>

      <DaoSwitcherModal isOpen={modals.changeDao} />
    </>
  );
};

export default ChangeDao;
