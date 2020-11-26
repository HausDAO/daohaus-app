import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  Link,
  useToast,
} from '@chakra-ui/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDao } from '../../contexts/PokemolContext';

const ProfileMenu = ({ member }) => {
  const toast = useToast();
  const [dao] = useDao();
  const history = useHistory();

  const handleGuildkickClick = () => {
    history.push(
      `/dao/${dao.address}/proposals/new/guildkick?applicant=${member.memberAddress}`,
    );
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
        <MenuItem onClick={handleGuildkickClick}>GuildKick</MenuItem>
        <Link
          href={`https://3box.io/${member?.memberAddress}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>View 3box Profile</MenuItem>
        </Link>

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
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
