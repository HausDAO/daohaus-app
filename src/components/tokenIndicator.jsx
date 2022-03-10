import React, { useEffect, useState } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';

import CopyButton from './copyButton';
import TextBox from './TextBox';
import StaticAvatar from './staticAvatar';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { getExplorerLink } from '../utils/tokenExplorerApi';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import { truncateAddr } from '../utils/general';

const TokenIndicator = ({
  tooltip = true,
  tooltipText,
  link,
  tokenAddress,
  label = 'Token',
  href,
  hideCopy,
}) => {
  const { daochain } = useParams();
  const [contractName, setContractName] = useState(null);
  const name = contractName || truncateAddr(tokenAddress);
  const explorerLink = getExplorerLink(tokenAddress, daochain);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const tokenContract = createContract({
          address: tokenAddress,
          abi: LOCAL_ABI.ERC_20,
          chainID: daochain,
        });

        const name = await tokenContract.methods.name().call();

        setContractName(name);
      } catch (error) {
        console.error(error);
      }
    };

    if (tokenAddress) {
      fetchName();
    }
  }, [tokenAddress]);

  return (
    <ToolTipWrapper
      tooltip={tooltip}
      tooltipText={tooltipText}
      href={href}
      link={link}
    >
      <TextBox size='xs' mb={2}>
        {label}
      </TextBox>
      <Flex>
        <StaticAvatar name={name} address={tokenAddress} hideCopy />
        {hideCopy || (
          <CopyButton
            text={tokenAddress}
            iconProps={{ transform: 'translateY(6px)' }}
          />
        )}
        {explorerLink && (
          <Link href={explorerLink} isExternal>
            <Icon
              as={RiExternalLinkLine}
              name='explorer link'
              color='secondary.300'
              _hover={{ cursor: 'pointer' }}
            />
          </Link>
        )}
      </Flex>
    </ToolTipWrapper>
  );
};

export default TokenIndicator;
