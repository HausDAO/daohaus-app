import React from 'react';

import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import StaticAvatar from './staticAvatar';

const MemberIndicator = ({
  address,
  label,
  tooltip,
  tooltipText,
  link,
  shouldFetchProfile,
  name,
  avatarImg,
  layoutProps,
  onClick,
}) => (
  <ToolTipWrapper
    tooltip={tooltip}
    tooltipText={tooltipText}
    link={link}
    layoutProps={layoutProps}
    onClick={onClick}
  >
    <TextBox size='xs' mb={2}>
      {label}
    </TextBox>
    {address &&
      (shouldFetchProfile ? (
        <AddressAvatar addr={address} alwaysShowName />
      ) : (
        <StaticAvatar name={name} address={address} avatarImg={avatarImg} />
      ))}
  </ToolTipWrapper>
);

export default MemberIndicator;
