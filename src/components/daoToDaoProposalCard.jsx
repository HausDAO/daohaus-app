import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Box, Flex, Button } from '@chakra-ui/react';

const DaoToDaoProposalCard = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const inChildDao = daoid === proposal?.molochAddress;
  const status =
    inChildDao && proposal?.processed
      ? `${proposal.status}, unexecuted`
      : proposal.status;

  return (
    <>
      <Box fontSize='md' fontFamily='heading' fontWeight={700} pb={2}>
        Pending Membership Proposal
      </Box>
      <Box fontSize='xs'>{status}</Box>
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex h='20px' my={3}>
          <>
            <Badge
              colorScheme='green'
              variant={
                +proposal.yesShares > +proposal.noShares && status !== 'Failed'
                  ? 'solid'
                  : 'outline'
              }
              mr={3}
            >
              {`${proposal?.yesShares ? proposal.yesShares : '--'} Yes`}
            </Badge>
            <Badge
              colorScheme='red'
              variant={
                +proposal.noShares > +proposal.yesShares ? 'solid' : 'outline'
              }
            >
              {`${proposal?.noShares ? proposal.noShares : '--'} No`}
            </Badge>
          </>
        </Flex>
        <Button
          as={Link}
          size='sm'
          variant='outline'
          to={`/dao/${daochain}/${proposal?.molochAddress}/proposals/${proposal.proposalId}`}
        >
          {inChildDao ? 'View' : 'View in UberHAUS'}
        </Button>
      </Flex>
    </>
  );
};

export default DaoToDaoProposalCard;
