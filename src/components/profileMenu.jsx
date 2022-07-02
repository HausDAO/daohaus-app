import React, { useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  useToast,
} from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import { useAppModal } from '../hooks/useModals';
import { FORM } from '../data/formLegos/forms';
import { TX } from '../data/txLegos/contractTX';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';

import { getProfileForm } from '../utils/profile';

const ProfileMenu = ({ member, refreshProfile }) => {
  const toast = useToast();
  const { address, injectedProvider } = useInjectedProvider();
  const { stepperModal, formModal, closeModal } = useAppModal();
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { daochain, daoid } = useParams();
  const { daoMember } = useDaoMember();
  const { successToast, errorToast } = useOverlay();
  const { submitTransaction } = useTX();
  const { refreshMemberProfile } = useUser(null);
  const history = useHistory();
  const location = useLocation();

  const [canRageQuit, setCanRageQuit] = useState(false);

  const handleGuildKickClick = () => {
    formModal({
      ...FORM.GUILDKICK,
      localValues: { memberAddress: member.memberAddress },
    });
  };

  const handleRageQuitClick = () => formModal(FORM.RAGE_QUIT);

  const handleUpdateDelegateClick = () => formModal(FORM.UPDATE_DELEGATE);

  const profileForm = getProfileForm(profile => {
    successToast({ title: 'Updated Profile!' });
    refreshProfile(profile);
    closeModal();
  });

  const handleEditProfile = useCallback(() => {
    stepperModal(profileForm);
    history.push(`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`);
  }, [member.memberAddress, refreshMemberProfile, profileForm]);

  useEffect(() => {
    const edit = new URLSearchParams(location.search).get('edit');
    if (edit) {
      handleEditProfile();
    }
  }, [handleEditProfile, location.search]);

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const userRejectedToast = () => {
    errorToast({
      title: 'User rejected transaction signature.',
    });
  };

  const handleRageKick = async () => {
    try {
      await submitTransaction({
        tx: TX.RAGE_KICK,
        args: [member.memberAddress],
      });
    } catch (err) {
      userRejectedToast();
    }
  };

  const isMember =
    address &&
    member?.memberAddress &&
    address.toLowerCase() === member?.memberAddress.toLowerCase();

  const hasSharesOrLoot = +member.shares > 0 || +member.loot > 0;

  useEffect(() => {
    const getCanRageQuit = async () => {
      if (daoMember?.highestIndexYesVote?.proposalIndex) {
        const molochContract = createContract({
          address: daoid,
          abi: LOCAL_ABI.MOLOCH_V2,
          chainID: daochain,
          web3: injectedProvider,
        });

        const localCanRage = await molochContract.methods
          .canRagequit(daoMember?.highestIndexYesVote?.proposalIndex)
          .call();

        setCanRageQuit(localCanRage);
      } else {
        setCanRageQuit(true);
      }
    };
    getCanRageQuit();
  }, [daoMember]);

  return (
    <Menu>
      <MenuButton>
        <Icon
          as={BsThreeDotsVertical}
          color='secondary.400'
          h='30px'
          w='30px'
          _hover={{ cursor: 'pointer' }}
        />
      </MenuButton>
      <MenuList>
        <CopyToClipboard text={member?.memberAddress} onCopy={copiedToast}>
          <MenuItem>Copy Address</MenuItem>
        </CopyToClipboard>

        {address === member.memberAddress && (
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        )}
        {canInteract ? (
          <>
            {isMember && hasSharesOrLoot && (
              <MenuItem onClick={handleRageQuitClick}>RageQuit</MenuItem>
            )}
            {isMember && hasSharesOrLoot && canRageQuit && (
              <MenuItem onClick={handleUpdateDelegateClick}>
                Add Delegate Key
              </MenuItem>
            )}
            {!isMember &&
              member.exists &&
              !member.jailed &&
              hasSharesOrLoot && (
                <MenuItem onClick={handleGuildKickClick}>GuildKick</MenuItem>
              )}
            {!isMember && member.jailed && hasSharesOrLoot && (
              <MenuItem onClick={handleRageKick}>RageKick</MenuItem>
            )}
          </>
        ) : null}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
