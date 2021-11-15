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
import { useAppModal } from '../hooks/useModals';
import { CORE_FORMS, FORM, STEPPER_FORMS } from '../data/forms';
import { TX } from '../data/contractTX';
import { createContract } from '../utils/contract';
import { daoConnectedAndSameChain } from '../utils/general';
import { LOCAL_ABI } from '../utils/abi';
import { getBasicProfile, setBasicProfile, cacheProfile } from '../utils/3box';

const ProfileMenu = ({ member, refreshProfile }) => {
  const toast = useToast();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { stepperModal, formModal, closeModal } = useAppModal();
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
    stepperModal({
      DISPLAY: {
        type: 'form',
        title: 'Edit Ceramic Profile',
        checklist: ['isConnected', 'isMember'],
        next: {
          type: 'awaitCustom',
          awaitDef: {
            func: async (setValue, values) => {
              if (values.ceramicDid) {
                const profile = await getBasicProfile(values.ceramicDid.id);
                setValue('name', profile?.name || '');
                setValue('emoji', profile?.emoji || '');
                setValue('description', profile?.description || '');
                setValue('homeLocation', profile?.homeLocation || '');
                setValue('residenceCountry', profile?.residenceCountry || '');
                setValue('url', profile?.url || '');
              }
            },
            args: [],
          },
          next: 'STEP2',
        },
        start: true,
        form: {
          ...STEPPER_FORMS.CERAMIC_AUTH,
          checklist: ['isConnected', 'isMember'],
          disableCallback: values => {
            return !values?.ceramicDid;
          },
          ctaText: 'Next',
        },
      },
      STEP2: {
        type: 'form',
        title: 'Edit Ceramic Profile',
        form: {
          ...FORM.PROFILE,
          ctaText: 'Submit',
          formSuccessMessage: 'Connected',
          checklist: ['isConnected', 'isMember'],
          onSubmit: async ({ values }) => {
            const profile = {
              name: values?.name || '',
              emoji: values?.emoji || '',
              description: values?.description || '',
              homeLocation: values?.homeLocation || '',
              residenceCountry: values?.residenceCountry || '',
              url: values?.url || '',
            };
            await setBasicProfile(
              values.ceramicClient,
              values.ceramicDid,
              profile,
            );
            cacheProfile(profile, member.memberAddress);
            refreshProfile(profile);
            refreshMemberProfile();
            successToast({ title: 'Updated Profile!' });
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
