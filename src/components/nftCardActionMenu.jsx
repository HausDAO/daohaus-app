import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';

import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';

const NftCardActionMenu = ({ nft, loading }) => {
  const { minion } = useParams();
  const { setGenericModal } = useOverlay();
  const [modalData, setModalData] = useState(null);

  const handleActionClick = action => {
    console.log('action', action);
    setModalData({
      id: action.modalName,
      formLego: {
        ...action.formLego,
        localValues: { ...action.localValues, minonAddress: minion },
      },
    });
    setGenericModal({ [action.modalName]: true });
  };

  return (
    <>
      {modalData && (
        <GenericModal
          modalId={modalData.id}
          formLego={modalData.formLego}
          closeOnOverlayClick
        />
      )}

      <Menu isDisabled>
        <MenuButton
          as={Button}
          size='sm'
          variant='outline'
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
          isDisabled={loading}
        >
          <Icon
            as={BsThreeDots}
            color='secondary.400'
            h='20px'
            w='20px'
            _hover={{ cursor: 'pointer' }}
          />
        </MenuButton>

        <MenuList>
          {nft.actions.map(action => {
            return (
              <MenuItem
                key={action.menuLabel}
                onClick={() => handleActionClick(action)}
              >
                <Tooltip
                  hasArrow
                  shouldWrapChildren
                  placement='bottom'
                  label={action.toolTipLabel}
                >
                  {action.menuLabel}
                </Tooltip>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
};

export default NftCardActionMenu;
