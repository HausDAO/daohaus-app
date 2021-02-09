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

const ProfileMenu = ({ member }) => {
  const toast = useToast();
  const { address, injectedChain } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { setGenericModal } = useOverlay();
  const history = useHistory();

  const handleGuildkickClick = () => {
    history.push(
      `/dao/${daochain}/${daoid}/proposals/new/guildkick?applicant=${member.memberAddress}`,
    );
  };

  const isMember =
    address &&
    member.memberAddress &&
    address.toLowerCase() === member.memberAddress.toLowerCase();

  const hasSharesOrloot = +member.shares > 0 || +member.loot > 0;
  const daoConnectedAndSameChain = () => {
    return address && daochain && injectedChain?.chainId === daochain;
  };

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
        <CopyToClipboard
          text={member?.memberAddress}
          onCopy={() =>
            toast({
              title: 'Copied Address',
              position: 'top-right',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          }
        >
          <MenuItem>Copy Address</MenuItem>
        </CopyToClipboard>

        <Link
          href={`https://3box.io/${member?.memberAddress}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>View 3box Profile</MenuItem>
        </Link>

        {daoConnectedAndSameChain() ? (
          <>
            {isMember && hasSharesOrloot ? (
              <MenuItem onClick={() => setGenericModal({ rageQuit: true })}>
                RageQuit
              </MenuItem>
            ) : null}

            {!isMember && member.exists && hasSharesOrloot ? (
              <MenuItem onClick={handleGuildkickClick}>GuildKick</MenuItem>
            ) : null}
          </>
        ) : null}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
