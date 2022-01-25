import React, { useEffect, useState, useMemo } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
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
import { useAppModal } from '../hooks/useModals';
import useCanInteract from '../hooks/useCanInteract';
import { MINION_TYPES } from '../utils/proposalUtils';
import { fetchAmbModule } from '../utils/gnosis';
import { getMinionActionFormLego, getNftType } from '../utils/vaults';
import { getNftCardActions } from '../utils/nftData';

const NftCardActionMenu = ({ nft, minion, vault, minionType }) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { daoOverview } = useDao();
  const { daochain } = useParams();
  const { isMember } = useDaoMember();
  const { formModal } = useAppModal();
  const [actionsEnabled, enableActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const nftActions = useMemo(() => {
    if (minionType) {
      return getNftCardActions(
        vault.crossChainMinion ? MINION_TYPES.CROSSCHAIN_SAFE : minionType,
        nft,
        daochain,
      );
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

  const handleActionClick = async action => {
    setLoading(true);
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
        safeAddress: currentMinion.crossChainMinion
          ? currentMinion.foreignSafeAddress
          : currentMinion.safeAddress,
        foreignChainId: vault.foreignChainId,
        ambModuleAddress:
          vault.foreignSafeAddress &&
          (await fetchAmbModule(
            {
              chainId: daochain,
              address: vault.safeAddress,
            },
            vault.foreignChainId,
            vault.foreignSafeAddress,
          )),
      },
    );
    const nftType = getNftType(nft, action.nftTypeOverride);
    const formLego =
      action.formLego ||
      getMinionActionFormLego(
        nftType,
        vault.minionType === vault.crossChainMinion
          ? MINION_TYPES.CROSSCHAIN_SAFE
          : vault.minionType,
      );
    formModal({
      ...formLego,
      localValues,
    });
    setLoading(false);
  };

  return (
    <>
      <Menu isDisabled>
        <MenuButton
          as={Button}
          disabled={loading}
          size='sm'
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
        >
          <Icon
            as={loading ? FaSpinner : BsThreeDots}
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
                isDisabled={!(actionsEnabled && canInteract)}
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
