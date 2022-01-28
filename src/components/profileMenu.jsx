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
import { FORM } from '../data/forms';
import { TX } from '../data/txLegos/contractTX';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import {
  getBasicProfile,
  setBasicProfile,
  cacheProfile,
  authenticateDid,
} from '../utils/3box';

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

  const handleEditProfile = useCallback(() => {
    let client = null;
    let did = null;
    stepperModal({
      DISPLAY: {
        type: 'buttonAction',
        title: 'Edit Ceramic Profile',
        checklist: ['isConnected', 'isMember'],
        btnText: 'Connect',
        btnLabel: 'Connect to Ceramic',
        btnLoadingText: 'Connecting',
        btnNextCallback: values => {
          return values?.ceramicDid;
        },
        btnCallback: async (setValue, setLoading, setFormState) => {
          setLoading(true);
          try {
            [client, did] = await authenticateDid(
              window.ethereum.selectedAddress,
            );
            setValue('ceramicClient', client);
            setValue('ceramicDid', did);
            const profile = await getBasicProfile(did.id);
            setValue('name', profile?.name || '');
            setValue('emoji', profile?.emoji || '');
            setValue('description', profile?.description || '');
            setValue('homeLocation', profile?.homeLocation || '');
            setValue('url', profile?.url || '');
            setValue('image', profile?.image || '');
            setFormState('success');
          } catch (err) {
            console.error(err);
            setFormState('failed');
          }
          setLoading(false);
        },
        next: 'STEP2',
        start: true,
      },
      STEP2: {
        type: 'form',
        title: 'Edit Ceramic Profile',
        subtitle: 'Connected to Ceramic',
        form: {
          ...FORM.PROFILE,
          ctaText: 'Submit',
          formSuccessMessage: 'Connected',
          checklist: ['isConnected', 'isMember'],
          onSubmit: async ({ values }) => {
            const profileArray = Object.entries({
              name: values?.name || null,
              emoji: values?.emoji || null,
              description: values?.description || null,
              homeLocation: values?.homeLocation || null,
              url: values?.url || null,
              image: values?.image || null,
            }).filter(value => value[1] !== null);
            const profile = Object.fromEntries(profileArray);

            await setBasicProfile(client, did, profile);
            cacheProfile(profile, member.memberAddress);
            refreshProfile(profile);
            await refreshMemberProfile();
            successToast({ title: 'Updated Profile!' });
            client = null;
            did = null;
            closeModal();
          },
        },
        ctaText: 'Finish',
        isUserStep: true,
        finish: true,
        stepLabel: 'Update profile',
      },
    });
    history.push(`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`);
  }, [member.memberAddress, refreshMemberProfile]);

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
