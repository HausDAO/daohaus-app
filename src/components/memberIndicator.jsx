import React from 'react';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { LinkWrapper, ToolTipWrapper } from '../staticElements/wrappers';

const MemberIndicator = ({
  address, label, tooltip, tooltipText, link,
}) => (
  <ToolTipWrapper tooltip={tooltip} tooltipText={tooltipText}>
    <LinkWrapper link={link}>
      <TextBox size='xs' mb={2}>
        {label}
      </TextBox>
      {address && (
      <AddressAvatar
        addr={address}
        alwaysShowName
      />)}
    </LinkWrapper>
  </ToolTipWrapper>
);

export default MemberIndicator;
