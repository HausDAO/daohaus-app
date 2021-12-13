import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';
import { ParaSm } from '../components/typography';
import {
  InactiveButton,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingInactive,
} from './actionPrimitives';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import {
  cheatExecutionStatus,
  removeExecutionCheat,
} from '../utils/proposalCard';

const Processed = props => {
  const { voteData } = props;
  console.log(voteData);
  const { daoid, daochain } = useParams();

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color={voteData?.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          {voteData?.isPassing ? 'Passed' : 'Failed'}
        </ParaSm>
        <ParaSm fontStyle='italic'>and processed</ParaSm>
      </StatusDisplayBox>
      <VotingInactive
        {...props}
        justifyContent='space-between'
        voteData={voteData}
      />
      <Flex mt='2' alignItems='center'>
        <UserVoteData voteData={voteData} />
        <Flex ml='auto'>
          <InactiveButton size='sm' mr='2' leftIcon={<AiOutlineCheck />}>
            Processed
          </InactiveButton>
          <Button size='sm'>Early Execute</Button>
        </Flex>
      </Flex>
    </PropActionBox>
  );
};
export default Processed;
