import React from 'react';
import { Box } from '@chakra-ui/react';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import StaticAvatar from './staticAvatar';

const MemberIndicator = ({
  address, label, tooltip, tooltipText, link, shouldFetchProfile, name,
}) => (
  <ToolTipWrapper tooltip={tooltip} tooltipText={tooltipText} link={link}>
    <Box>
      <TextBox size='xs' mb={2}>
        {label}
      </TextBox>
      {address && (
        shouldFetchProfile
          ? <AddressAvatar
              addr={address}
              alwaysShowName
          />
          : <StaticAvatar name={name} address={address} />
      )}
    </Box>
  </ToolTipWrapper>
);

export default MemberIndicator;
