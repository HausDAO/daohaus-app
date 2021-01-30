import React from 'react';
import { Icon, Link } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

const ExplorerLink = ({ chainID, type, hash, isIconLink, children }) => {
  const uri = () => {
    switch (chainID) {
      case '0x1': {
        return `https://etherscan.io/${type}/`;
      }
      case '0x2a': {
        return `https://kovan.etherscan.io/${type}/`;
      }
      case '0x4': {
        return `https://rinkeby.etherscan.io/${type}/`;
      }
      case '0x64': {
        return `https://blockscout.com/poa/xdai/${type}/`;
      }
      default: {
        return `https://etherscan.io/${type}/`;
      }
    }
  };

  return isIconLink ? (
    <Link href={`${uri()}${hash}`} isExternal ml={2}>
      <Icon as={RiExternalLinkLine} name='transaction link' />
    </Link>
  ) : (
    <Link
      href={`${uri()}${hash}`}
      isExternal
      display='flex'
      alignItems='center'
    >
      {children}
    </Link>
  );
};

export default ExplorerLink;
