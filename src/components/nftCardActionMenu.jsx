import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
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

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useAppModal } from '../hooks/useModals';
import { daoConnectedAndSameChain } from '../utils/general';

const NftCardActionMenu = ({ nft, minion, vault }) => {
  const { daoOverview } = useDao();
  const { daochain } = useParams();
  const { isMember } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { formModal } = useAppModal();
  const [actionsEnabled, enableActions] = useState(false);

  useEffect(() => {
    enableActions(
      isMember &&
        (!vault ||
          !vault.safeAddress ||
          (vault.safeAddress && vault.isMinionModule)),
    );
  }, [vault]);

  const handleActionClick = action => {
    const currentMinion = daoOverview.minions.find(
      m => m.minionAddress === minion,
    );
    formModal({
      ...action.formLego,
      localValues: {
        ...action.localValues,
        minionAddress: currentMinion.minionAddress,
        safeAddress: currentMinion.safeAddress,
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
                    actionsEnabled &&
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
