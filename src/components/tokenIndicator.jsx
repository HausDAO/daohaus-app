import React, { useEffect, useState } from 'react';
import { Flex, Link } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';
import { RiExternalLinkLine } from 'react-icons/ri';

import { useParams } from 'react-router';
import TextBox from './TextBox';
import StaticAvatar from './staticAvatar';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { getTokenData } from '../utils/tokenValue';
import { truncateAddr } from '../utils/general';
import { TokenService } from '../services/tokenService';
import { getExplorerLink } from '../utils/tokenExplorerApi';

const TokenIndicator = ({
  tooltip = true,
  tooltipText,
  link,
  tokenAddress,
  label = 'Token',
  href,
}) => {
  const { daochain } = useParams();
  const [geckoData, setGeckoData] = useState(null);
  const [chainName, setChainName] = useState(null);
  const name =
    geckoData?.name ||
    chainName ||
    geckoData?.symbol ||
    truncateAddr(tokenAddress);
  const avatarImg = geckoData?.image?.thumb || null;
  const explorerLink = getExplorerLink(tokenAddress, daochain);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const name = await TokenService({ chainID: daochain, tokenAddress })(
          'name',
        )();
        setChainName(name);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchTokenData = async () => {
      try {
        const data = await getTokenData(tokenAddress);
        setGeckoData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (tokenAddress) {
      fetchTokenData();
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
        <StaticAvatar
          name={name}
          address={tokenAddress}
          avatarImg={avatarImg}
        />
        {explorerLink && (
          <Link href={explorerLink} isExternal>
            <Icon
              as={RiExternalLinkLine}
              name='explorer link'
              // transform='translateY(2px)'
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
