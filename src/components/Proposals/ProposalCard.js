import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Badge } from '@chakra-ui/core';

import { useDao } from '../../contexts/PokemolContext';

const ProposalCard = ({ proposal }) => {
  const [dao] = useDao();
  const details = JSON.parse(proposal.details);

  return (
    <Link to={`/dao/${dao.address}/proposals/${proposal.proposalId}`}>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        mt={2}
      >
        <Flex>
          <Box minWidth='30%' mr={5}>
            <Text fontSize='0.8em' textTransform='uppercase'>
              {proposal.proposalType}
            </Text>
            <Text fontWeight={700} fontSize='1.5em'>
              {details.title}
            </Text>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Badge variantColor='green' mr={3}>
                {proposal.yesVotes} Yes
              </Badge>
              <Badge variantColor='red'>{proposal.noVotes} No</Badge>
            </Flex>
          </Flex>
        </Flex>
        <Flex w='80%' justify='space-between' mt={10}>
          <Box>
            <Text textTransform='uppercase' fontSize='0.8em'>
              Tribute
            </Text>
            <Text>25,000 Dai</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase' fontSize='0.8em'>
              Shares
            </Text>
            <Text>25</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase' fontSize='0.8em'>
              Loot
            </Text>
            <Text>50</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase' fontSize='0.8em'>
              Voting Period Ends
            </Text>
            <Text>4 days from now</Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProposalCard;
