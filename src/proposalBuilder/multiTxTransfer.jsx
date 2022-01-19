import React, { useState } from 'react';
import { Box, Button, Divider, Flex, Icon } from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { v4 as uuid } from 'uuid';

import TextBox from '../components/TextBox';
import { ParaMd } from '../components/typography';
import { useAppModal } from '../hooks/useModals';

import {
  AsyncCardTransfer,
  PropCardError,
  PropCardTransfer,
} from './propBriefPrimitives';

const CONTRACT_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const MultiTxTransfer = ({ minionAction }) => {
  const { genericModal } = useAppModal();

  if (minionAction?.status === 'error') {
    return <PropCardError message={minionAction.message} />;
  }

  const displayDetails = () => {
    genericModal({
      title: 'Action Details',
      subtitle: `Gnosis Safe Minion Multisend TX`,
      body: minionAction?.decoded?.actions?.map((action, index) => (
        <SingleActionDisplay key={uuid()} action={action} index={index} />
      )),
    });
  };

  const customUI = (
    <ParaMd>
      Multicall x{minionAction?.decoded?.actions?.length} (
      <Button
        size='sm'
        variant='text'
        p='0'
        color='secondary.400'
        onClick={displayDetails}
      >
        <ParaMd>View Details</ParaMd>
      </Button>
      )
    </ParaMd>
  );

  return (
    <AsyncCardTransfer
      outgoing
      isLoaded={minionAction?.decoded}
      customUI={customUI}
    />
  );
};

export default MultiTxTransfer;

const ActionItem = ({ label, data }) => (
  <Box mb={2}>
    <TextBox size='xs' variant='label'>
      {label}
    </TextBox>
    <TextBox variant='body'>{data}</TextBox>
  </Box>
);

const SingleActionDisplay = ({ action, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(prevState => !prevState);
  return (
    <Box mb={6}>
      <Button
        variant='ghost'
        textAlign='left'
        justifyContent='flex-start'
        width='100%'
        px={0}
        onClick={toggleOpen}
      >
        <Flex width='100%' justifyContent='center' alignItems='flex-start'>
          <ActionItem label={`TX ${index + 1}`} data={action.data.name} />
          <Icon
            as={isOpen ? BiChevronDown : BiChevronUp}
            ml='auto'
            w='25px'
            h='25px'
            cursor='pointer'
            color='secondary.400'
            onClick={toggleOpen}
          />
        </Flex>
      </Button>
      <Divider mb={3} />
      {isOpen && (
        <>
          <ActionItem label='Target Contract' data={action.to} />
          {action.value !== CONTRACT_ZERO && (
            <ActionItem label='Target Contract' data={action.to} />
          )}
          <TextBox size='xs' variant='label' mb={3}>
            Parameters:
          </TextBox>
          <Box ml='6'>
            {action.data.params.map((param, index, params) => (
              <Box key={uuid()} mb={3}>
                <ActionItem label='Name:' data={param.name} />
                <ActionItem label='Data Type:' data={param.type} />
                <ActionItem label='Value:' data={param.value.toString()} />
                {index !== params?.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
          <Divider />
        </>
      )}
    </Box>
  );
};
