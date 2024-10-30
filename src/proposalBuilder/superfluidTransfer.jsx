import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Divider, Flex, Icon, Skeleton } from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';

import { useAppModal } from '../hooks/useModals';
import TextBox from '../components/TextBox';
import { Bold, ParaMd } from '../components/typography';
import { AsyncCardTransfer, PropCardError } from './proposalBriefPrimitives';
import { MINION_TYPES } from '../utils/proposalUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';

const SuperfluidTransfer = ({ minionAction, proposal }) => {
  const { daochain } = useParams();
  const [loading, setLoading] = useState(false);
  const [streamRateDetails, setstreamRateDetails] = useState(null);
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

  const streamDetails = async () => {
    setLoading(true);
    const details = JSON.parse(proposal.details);
    if (details.tokenRate) {
      const token = await fetchSpecificTokenData(
        details.token,
        {
          symbol: true,
          decimals: true,
        },
        daochain,
      );
      const sliceIdx = details.tokenRate.indexOf(' per ');
      setstreamRateDetails(
        sliceIdx > 0
          ? `${details.tokenRate.slice(0, sliceIdx)} ${
              token.symbol
            } ${details.tokenRate.slice(sliceIdx)}`
          : `${Number(
              Number(details.tokenRate) / 10 ** Number(token.decimals),
            ).toPrecision(10)} ${token.symbol} per sec`,
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (proposal) {
      streamDetails();
    }
  }, [proposal]);

  const customUI = proposal.minion.minionType === MINION_TYPES.SAFE && (
    <ParaMd>
      Multicall x{minionAction?.decoded?.actions?.length} (
      <Button
        size='fit-content'
        variant='text'
        color='secondary.400'
        onClick={displayDetails}
        lineHeight='1.1rem'
      >
        <ParaMd>View Details</ParaMd>
      </Button>
      )
    </ParaMd>
  );

  return (
    <Skeleton isLoaded={!loading && minionAction?.decoded} height='3rem'>
      <Flex direction='column'>
        {streamRateDetails && (
          <ParaMd height='1.5rem'>
            <Bold>Streaming Rate: </Bold>
            {streamRateDetails}
          </ParaMd>
        )}
        {proposal.minion.minionType === MINION_TYPES.SAFE && (
          <AsyncCardTransfer
            isLoaded={minionAction?.decoded}
            customUI={customUI}
          />
        )}
      </Flex>
    </Skeleton>
  );
};

export default SuperfluidTransfer;

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
        disabled={action.data.error}
        variant='ghost'
        textAlign='left'
        justifyContent='flex-start'
        width='100%'
        px={0}
        onClick={toggleOpen}
      >
        <Flex width='100%' justifyContent='center' alignItems='flex-start'>
          <ActionItem
            label={`TX ${index + 1}`}
            data={action.data.name || action.data.message}
          />
          <Icon
            as={isOpen ? BiChevronDown : BiChevronUp}
            ml='auto'
            w='25px'
            h='25px'
            cursor='pointer'
            color='secondary.400'
          />
        </Flex>
      </Button>
      <Divider mb={3} />
      {isOpen && (
        <>
          {action.value !== ethers.constants.AddressZero && (
            <ActionItem label='Target Contract' data={action.to} />
          )}
          {action.data.actions ? (
            <>
              <Box mb={3}>
                <ActionItem
                  label='Value:'
                  data={Number(action.value).toString(10)}
                />
                <ActionItem
                  label='Actions:'
                  data={`x${action.data.actions.length}`}
                />
              </Box>
              <Box ml='6'>
                {action.data.actions?.map((subaction, idx) => (
                  <SingleActionDisplay
                    key={uuid()}
                    action={subaction}
                    index={idx}
                  />
                ))}
              </Box>
            </>
          ) : (
            <>
              <TextBox size='xs' variant='label' mb={3}>
                Parameters:
              </TextBox>
              <Box ml='6'>
                {action.data.params.map((param, index, params) => (
                  <Box key={uuid()} mb={3}>
                    <ActionItem label='Name:' data={param.name} />
                    <ActionItem label='Data Type:' data={param.type} />
                    <ActionItem
                      label='Value:'
                      data={param.value?.toString() || '0x'}
                    />
                    {index !== params?.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </>
          )}
          <Divider />
        </>
      )}
    </Box>
  );
};
