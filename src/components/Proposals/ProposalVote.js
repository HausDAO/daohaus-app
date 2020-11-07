import React from 'react';
import { Box, Flex, Icon, Text, Skeleton } from '@chakra-ui/core';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const ProposalVote = ({ proposal }) => {
  // const [totalVotes, setTotalVotes]
  console.log(
    (+proposal?.yesVotes / (+proposal?.yesVotes + +proposal?.noVotes)) * 100,
  );
  return (
    <>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={10}
        m={6}
        ml={0}
        w='90%'
      >
        <Flex mb={6}>
          <Flex w='48%' justify='space-around'>
            <Flex
              p={3}
              borderWidth='1px'
              borderColor='green.500'
              borderStyle='solid'
              borderRadius='40px'
              justiy='center'
              align='center'
            >
              <Icon
                as={FaThumbsUp}
                color='green.500'
                w='25px'
                h='25px'
                _hover={{ cursor: 'ponter' }}
              />
            </Flex>
            <Flex
              p={3}
              borderWidth='1px'
              borderColor='red.500'
              borderStyle='solid'
              borderRadius='40px'
              justiy='center'
              align='center'
            >
              <Icon
                as={FaThumbsDown}
                color='red.500'
                w='25px'
                h='25px'
                transform='rotateY(180deg)'
                _hover={{ cursor: 'ponter' }}
              />
            </Flex>
          </Flex>
          <Flex justify='flex-end' align='center' w='50%'>
            <Skeleton isLoaded={true}>
              <Text as='i' fontSize='xs'>
                Currently Passing
              </Text>
            </Skeleton>
          </Flex>
        </Flex>
        <Box
          w='100%'
          h='20px'
          borderRadius='6px'
          backgroundColor='white'
          display='flex'
          flexDirection='row'
        >
          {+proposal?.yesVotes > 0 && (
            <Box
              w={`${(+proposal?.yesVotes /
                (+proposal.yesVotes + +proposal.noVotes)) *
                100}%`}
              h='100%'
              backgroundColor='green.500'
              borderRadius='6px'
            />
          )}
          {+proposal?.noVotes > 0 && (
            <Box
              w={`${(+proposal?.noVotes /
                (+proposal.yesVotes + +proposal.noVotes)) *
                100}%`}
              h='100%'
              backgroundColor='red.500'
              borderRadius='6px'
            />
          )}
        </Box>
        <Flex justify='space-between' mt={3}>
          <Skeleton isLoaded={proposal?.yesVotes}>
            <Text>{proposal?.yesVotes || '0'} Yes</Text>
          </Skeleton>
          <Skeleton isLoaded={proposal?.noVotes}>
            <Text>{proposal?.noVotes || '0'} No</Text>
          </Skeleton>
        </Flex>
      </Box>
    </>
  );
};

export default ProposalVote;
