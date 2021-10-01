import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { Icon, useToast } from '@chakra-ui/react';

const CopyButton = ({
  text,
  iconProps,
  copyProps,
  customMessage = 'Copied Address',
}) => {
  const toast = useToast();
  const handleCopy = () => {
    toast({
      title: customMessage,
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <CopyToClipboard text={text} mr={2} onCopy={handleCopy} {...copyProps}>
      <Icon
        transform='translateY(2px)'
        as={FaCopy}
        color='secondary.300'
        ml={2}
        _hover={{ cursor: 'pointer' }}
        {...iconProps}
      />
    </CopyToClipboard>
  );
};

export default CopyButton;
