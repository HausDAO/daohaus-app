import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  Link,
  useToast,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useDao } from '../contexts/DaoContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { daoConnectedAndSameChain } from '../utils/general';

const ProfileMenu = ({ member }) => {
  const toast = useToast();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const {
    setGenericModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const history = useHistory();

  const handleGuildkickClick = () => {
    history.push(
      `/dao/${daochain}/${daoid}/proposals/new/guildkick?applicant=${member.memberAddress}`,
    );
  };

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
    const args = [member.memberAddress];

    const onTxHash = () => {
      setTxInfoModal(true);
    };

    try {
      const poll = createPoll({ action: 'ragekick', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        memberAddress: member.memberAddress,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not ragekick member: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Member kicked',
            });
            resolvePoll(txHash);
          },
        },
      });
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview?.version,
      })('ragekick')({
        args,
        address,
        poll,
        onTxHash,
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

  const hasSharesOrloot = +member.shares > 0 || +member.loot > 0;

  console.log('member', member);

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

        <Link
          href={`https://3box.io/${member?.memberAddress}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>View 3box Profile</MenuItem>
        </Link>

        {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) ? (
          <>
            {isMember && hasSharesOrloot && (
              <MenuItem onClick={() => setGenericModal({ rageQuit: true })}>
                RageQuit
              </MenuItem>
            )}
            {isMember && hasSharesOrloot && (
              <MenuItem
                onClick={() => setGenericModal({ updateDelegate: true })}
              >
                Add Delegate Key
              </MenuItem>
            )}
            {!isMember &&
              member.exists &&
              !member.jailed &&
              hasSharesOrloot && (
                <MenuItem onClick={handleGuildkickClick}>GuildKick</MenuItem>
              )}
            {!isMember && member.jailed && hasSharesOrloot && (
              <MenuItem onClick={handleRageKick}>RageKick</MenuItem>
            )}
          </>
        ) : null}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
