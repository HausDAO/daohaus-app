import React, { useEffect, useState } from 'react';
import { Flex, Link } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';
import { RiExternalLinkLine } from 'react-icons/ri';

import TextBox from './TextBox';
import StaticAvatar from './staticAvatar';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { getTokenData } from '../utils/tokenValue';
import { truncateAddr } from '../utils/general';

const TokenIndicator = ({
  tooltip = true,
  tooltipText,
  link,
  tokenAddress,
  parentData,
  label = 'Token',
  href,
  explorerLink,
}) => {
  const [tokenData, setTokenData] = useState(null);
  const name =
    parentData?.name ||
    tokenData?.name ||
    tokenData?.symbol ||
    truncateAddr(tokenAddress);
  const avatarImg = parentData?.image?.thumb || null;

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const data = await getTokenData(tokenAddress);
        console.log(data);
        setTokenData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (tokenAddress && !parentData) {
      fetchTokenData();
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
