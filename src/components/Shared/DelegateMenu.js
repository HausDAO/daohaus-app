import React from 'react';
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

const DelegateMenu = ({ member }) => {
  const toast = useToast();

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

export default DelegateMenu;
