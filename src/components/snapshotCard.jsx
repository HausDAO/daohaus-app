import React, { useEffect, useState } from 'react';
import { Flex, Box, HStack, Stack, Link } from '@chakra-ui/react';
import { format } from 'date-fns';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { getSnapshotVotes } from '../utils/requests';

const SnapshotCard = ({ snapshotId, snapshot }) => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const getVotes = async () => {
      try {
        const localVotes = await getSnapshotVotes(
          snapshot.msg.space,
          snapshotId,
        );
        setVotes(localVotes);
      } catch (err) {
        console.log(err);
      }
    };
    getVotes();
  }, []);

  return (
    <ContentBox
      as={Link}
      href={`https://snapshot.org/#/${snapshot.msg.space}/proposal/${snapshotId}`}
      w='60%'
      isExternal
    >
      <Stack spacing={4}>
        <TextBox size='lg' color='whiteAlpha.900' maxW='80%'>
          {snapshot.msg.payload.name}
        </TextBox>
        <TextBox variant='value' size='sm'>
          {snapshot.msg.payload.body.length > 225
            ? `${snapshot.msg.payload.body.slice(0, 225)}...`
            : snapshot.msg.payload.body}
        </TextBox>
        <Flex w='100%' justify='space-between' align='flex-end'>
          <Box>
            <Flex as={HStack} spacing={2} align='center'>
              <TextBox>Starts:</TextBox>
              <TextBox variant='value'>
                {format(snapshot.msg.payload.start * 1000, 'MMMM d, yyyy p')}
              </TextBox>
            </Flex>
            <Flex as={HStack} spacing={2} align='center'>
              <TextBox>Ends:</TextBox>
              <TextBox variant='value'>
                {format(snapshot.msg.payload.end * 1000, 'MMMM d, yyyy p')}
              </TextBox>
            </Flex>
          </Box>
          <Box>
            <Flex as={HStack} spacing={2} align='center'>
              <TextBox>Votes:</TextBox>
              <TextBox variant='value'>
                {(votes && Object.keys(votes).length) || 0}
              </TextBox>
            </Flex>
          </Box>
        </Flex>
      </Stack>
    </ContentBox>
  );
};

export default SnapshotCard;
