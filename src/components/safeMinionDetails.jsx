import React from 'react';
import { Box } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

const SafeMinionDetails = ({ vault, handleCopy }) => {
  return (
    <ContentBox mt={6}>
      <TextBox size='xs' mb={6}>
        Safe Minion
      </TextBox>
      <Box fontFamily='mono' mb={5}>
        Gnosis Safe
        <CopyToClipboard text={vault.safeAddress} onCopy={handleCopy}>
          <Box color='secondary.300'>
            {vault.safeAddress}
            <Icon
              as={FaCopy}
              color='secondary.300'
              ml={2}
              _hover={{ cursor: 'pointer' }}
            />
          </Box>
        </CopyToClipboard>
      </Box>
      <Box fontFamily='mono'>
        Minion Address (Do Not Send Funds)
        <CopyToClipboard text={vault.address} onCopy={handleCopy}>
          <Box color='secondary.300'>
            {vault.address}
            <Icon
              as={FaCopy}
              color='secondary.300'
              ml={2}
              _hover={{ cursor: 'pointer' }}
            />
          </Box>
        </CopyToClipboard>
      </Box>
    </ContentBox>
  );
};

export default SafeMinionDetails;
