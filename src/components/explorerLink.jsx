import React from 'react';
import { Icon, Link } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { supportedChains } from '../utils/chain';

const ExplorerLink = ({ chainID, type, hash, isIconLink, children }) => {
  return isIconLink ? (
    <Link
      href={`${supportedChains[chainID].block_explorer}/${type}/${hash}`}
      isExternal
      ml={2}
    >
      <Icon as={RiExternalLinkLine} name='transaction link' />
    </Link>
  ) : (
    <Link
      href={`${supportedChains[chainID].block_explorer}/${type}/${hash}`}
      isExternal
      display='flex'
      alignItems='center'
    >
      {children}
    </Link>
  );
};

export default ExplorerLink;
