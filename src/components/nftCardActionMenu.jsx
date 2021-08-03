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
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import GenericModal from '../modals/genericModal';
import { daoConnectedAndSameChain } from '../utils/general';
import { useDaoMember } from '../contexts/DaoMemberContext';

const NftCardActionMenu = ({ nft, loading }) => {
  const { minion, daochain } = useParams();
  const { isMember } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();
  const [modalData, setModalData] = useState(null);

  const handleActionClick = action => {
    setModalData({
      id: action.modalName,
      formLego: {
        ...action.formLego,
        localValues: {
          ...action.localValues,
          minionAddress: minion,
          nftImage: nft.metadata?.image,
        },
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
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
          isDisabled={loading}
        >
          <Icon
            as={BsThreeDots}
            color='white'
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
                isDisabled={
                  !(
                    isMember &&
                    daoConnectedAndSameChain(
                      address,
                      daochain,
                      injectedChain?.chainId,
                    )
                  )
                }
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
