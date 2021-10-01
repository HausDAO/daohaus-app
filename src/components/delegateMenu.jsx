import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Menu,
  MenuList,
  Icon,
  MenuButton,
  MenuItem,
  Link,
} from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';

const DelegateMenu = ({ member }) => {
  const { successToast } = useOverlay();

  const copiedToast = () => {
    successToast({
      title: 'Copied Address',
    });
  };

  return (
    <Menu>
      <MenuButton>
        <Icon
          as={BsThreeDotsVertical}
          color='secondary.400'
          h='20px'
          w='20px'
          _hover={{ cursor: 'pointer' }}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => console.log('emergency recall proposal')}>
          Emergency Recall
        </MenuItem>
        <Link
          href={`https://3box.io/${member?.memberAddress}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <MenuItem>View 3box Profile</MenuItem>
        </Link>

        <CopyToClipboard text={member?.memberAddress} onCopy={copiedToast}>
          <MenuItem>Copy Address</MenuItem>
        </CopyToClipboard>
      </MenuList>
    </Menu>
  );
};

export default DelegateMenu;
