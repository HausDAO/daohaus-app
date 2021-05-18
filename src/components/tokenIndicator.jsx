import React, { useEffect, useState } from 'react';

import TextBox from './TextBox';
import StaticAvatar from './staticAvatar';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { getTokenData } from '../utils/tokenValue';
import { truncateAddr } from '../utils/general';

const TokenIndicator = ({
  tooltip = true,
  tooltipText,
  parentLink,
  tokenAddress,
  tokenDataFromParent,
  label,
}) => {
  const [tokenData, setTokenData] = useState(tokenDataFromParent || null);

  const name =
    tokenData?.name || tokenData?.symbol || truncateAddr(tokenAddress);
  const avatarImg = tokenData?.image?.thumb || null;
  const link =
    parentLink || tokenData?.id
      ? `https://www.coingecko.com/en/coins/${tokenData?.id}`
      : null;
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
    if (tokenAddress && !tokenDataFromParent) {
      fetchTokenData();
    }
  }, [tokenAddress]);
  return (
    <ToolTipWrapper tooltip={tooltip} tooltipText={tooltipText} link={link}>
      <TextBox size='xs' mb={2}>
        {label}
      </TextBox>

      <StaticAvatar name={name} address={tokenAddress} avatarImg={avatarImg} />
    </ToolTipWrapper>
  );
};

export default TokenIndicator;
