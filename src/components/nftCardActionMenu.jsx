import React, { useEffect, useState, useMemo } from 'react';
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
import { getMinionActionFormLego, getNftType } from '../utils/vaults';
import { getNftCardActions } from '../utils/nftData';

const NftCardActionMenu = ({ nft, minion, vault, minionType }) => {
  const { daoOverview } = useDao();
  const { daochain } = useParams();
  const { isMember } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { formModal } = useAppModal();
  const [actionsEnabled, enableActions] = useState(false);

  const nftActions = useMemo(() => {
    if (minionType) {
      return getNftCardActions(minionType, nft, daochain);
    }
  }, [minionType]);

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
    const localValues = action.localValues.reduce(
      (vals, key) => {
        vals[key] = nft[key];
        return vals;
      },
      {
        minionAddress: currentMinion.minionAddress,
        safeAddress: currentMinion.safeAddress,
      },
    );
    const nftType = getNftType(nft, action.nftTypeOverride);
    const formLego =
      action.formLego || getMinionActionFormLego(nftType, minionType);
    formModal({
      ...formLego,
      localValues,
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
          {nftActions.map(action => {
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
