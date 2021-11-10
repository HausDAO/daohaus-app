import React, { useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical, BsCheckCircle } from 'react-icons/bs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiErrorCircle } from 'react-icons/bi';
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
import { useAppModal } from '../hooks/useModals';
import { CORE_FORMS, FORM } from '../data/forms';
import { TX } from '../data/contractTX';
import { createContract } from '../utils/contract';
import { daoConnectedAndSameChain } from '../utils/general';
import { LOCAL_ABI } from '../utils/abi';
import {
  authenticateDid,
  getBasicProfile,
  setBasicProfile,
  cacheProfile,
} from '../utils/3box';

const ProfileMenu = ({ member, refreshProfile }) => {
  const toast = useToast();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { formModal, closeModal } = useAppModal();
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

  const handleRageQuitClick = () => formModal(CORE_FORMS.RAGE_QUIT);

  const handleUpdateDelegateClick = () => formModal(CORE_FORMS.UPDATE_DELEGATE);

  const handleEditProfile = useCallback(() => {
    let client = null;
    let did = null;
    const indicatorStates = {
      loading: {
        spinner: true,
        title: 'Connecting...',
        explorerLink: true,
      },
      success: {
        icon: BsCheckCircle,
        title: 'Connected',
        explorerLink: true,
      },
      error: {
        icon: BiErrorCircle,
        title: 'Failed to connect',
        errorMessage: true,
      },
    };

    formModal({
      ...FORM.PROFILE,
      indicatorStates,
      required: [],
      fields: [...FORM.PROFILE.fields],
      checklist: ['isConnected', 'isMember'],
      onSubmit: async () => {
        if (did?.authenticated) {
          closeModal();
          const profile = await getBasicProfile(did.id);
          formModal({
            ...FORM.PROFILE,
            ctaText: 'Submit',
            formSuccessMessage: 'Connected',
            checklist: ['isConnected', 'isMember'],
            defaultValues: {
              name: profile?.name || '',
              emoji: profile?.emoji || '',
              description: profile?.description || '',
              homeLocation: profile?.homeLocation || '',
              residenceCountry: profile?.residenceCountry || '',
              url: profile?.url || '',
            },
            onSubmit: async ({ values }) => {
              await setBasicProfile(client, did, values);
              cacheProfile(values, member.memberAddress);
              refreshProfile(values);
              refreshMemberProfile();
              successToast({ title: 'Updated Profile!' });
              closeModal();
            },
          });
        }
      },
      removeBlurCallback: async () => {
        [client, did] = await authenticateDid(member.memberAddress);
        return true;
      },
    });
    history.push(`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`);
  }, [member.memberAddress]);

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
      console.log('error: ', err);
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

        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>

        {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) ? (
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
