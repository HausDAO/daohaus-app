import React from 'react';
import { Box } from '@chakra-ui/react';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';

const MemberIndicator = ({
  address, label, tooltip, tooltipText, link,
}) => (
  <ToolTipWrapper tooltip={tooltip} tooltipText={tooltipText} link={link}>
    <Box>
      <TextBox size='xs' mb={2}>
        {label}
      </TextBox>
      {address && (
      <AddressAvatar
        addr={address}
        alwaysShowName
      />)}
    </Box>
  </ToolTipWrapper>
);

export default MemberIndicator;
