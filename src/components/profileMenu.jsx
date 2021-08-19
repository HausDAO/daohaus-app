import React, { useEffect, useState } from 'react';
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
import { useDaoMember } from '../contexts/DaoMemberContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { daoConnectedAndSameChain } from '../utils/general';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';

const ProfileMenu = ({ member }) => {
  const toast = useToast();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoMember } = useDaoMember();
  const { daoOverview } = useDao();
  const {
    setGenericModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const history = useHistory();

  const [canRageQuit, setCanRageQuit] = useState(false);

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
            {isMember && hasSharesOrloot && canRageQuit && (
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
