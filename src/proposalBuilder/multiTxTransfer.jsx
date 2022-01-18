import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import TextBox from '../components/TextBox';
import { ParaMd } from '../components/typography';
import { useAppModal } from '../hooks/useModals';

import { AsyncCardTransfer } from './propBriefPrimitives';

const CONTRACT_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const MultiTxTransfer = ({ minionAction, proposal }) => {
  const { proposalId } = proposal;
  const { daochain, daoid } = useParams();

  const { genericModal } = useAppModal();

  const displayDetails = () => {
    console.log(minionAction);
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

const SingleActionDisplay = ({ action, index }) => (
  <Box mb={6}>
    <ActionItem label={`TX ${index + 1}`} data={action.data.name} />
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
  </Box>
);
