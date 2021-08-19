import React from 'react';
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

import { useFormModal } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { useDaoMember } from '../contexts/DaoMemberContext';

const NftCardActionMenu = ({ nft, minion }) => {
  const { daochain } = useParams();
  const { isMember } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { openFormModal } = useFormModal();

  const handleActionClick = action => {
    openFormModal({
      lego: {
        ...action.formLego,
        localValues: {
          ...action.localValues,
          minionAddress: minion,
        },
      },
    });
  };

  return (
    <>
      <Menu isDisabled>
        <MenuButton
          as={Button}
          size='sm'
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
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
