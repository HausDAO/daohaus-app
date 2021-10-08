import React from 'react';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { RiMenu3Line } from 'react-icons/ri';
import {
  IconButton,
  Link,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';

const ChangeDao = () => {
  const { setDaoSwitcherModal } = useOverlay();
  const changeIcon = useBreakpointValue({
    base: <HiOutlineSwitchVertical />,
    sm: <HiOutlineSwitchVertical />,
    md: <HiOutlineSwitchVertical />,
    lg: <RiMenu3Line />,
  });

  const toggleModal = () => setDaoSwitcherModal(prevState => !prevState);
  return (
    <>
      <Tooltip
        label='Change DAO'
        aria-label='Change DAO'
        placement='right'
        hasArrow
      >
        <IconButton
          icon={changeIcon}
          size='lg'
          variant='ghost'
          isRound='true'
          as={Link}
          onClick={toggleModal}
        />
      </Tooltip>
    </>
  );
};

export default ChangeDao;
