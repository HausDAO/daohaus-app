import React from 'react';
import {
  IconButton,
  Link,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { RiMenu3Line, RiArrowDropDownLine } from 'react-icons/ri';
// import DaoSwitcherModal from "../Modal/DaoSwitcherModal";
// import { useModals } from "../../contexts/PokemolContext";

const ChangeDao = () => {
  // const { modals, openModal } = useModals();
  const changeIcon = useBreakpointValue({
    base: <RiArrowDropDownLine />,
    sm: <RiArrowDropDownLine />,
    md: <RiArrowDropDownLine />,
    lg: <RiMenu3Line />,
  });

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
          // onClick={() => openModal("changeDao")}
        />
      </Tooltip>

      {/* <DaoSwitcherModal isOpen={modals.changeDao} /> */}
    </>
  );
};

export default ChangeDao;
