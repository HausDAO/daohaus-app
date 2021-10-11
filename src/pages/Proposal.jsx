import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Stack, Link, Icon, IconButton } from '@chakra-ui/react';
import { RiArrowLeftLine, RiRefreshLine } from 'react-icons/ri';

import { useTX } from '../contexts/TXContext';
import ActivitiesFeed from '../components/activitiesFeed';
import MainViewLayout from '../components/mainViewLayout';
import ProposalActions from '../components/proposalActions';
import ProposalDetails from '../components/proposalDetails';
import TextBox from '../components/TextBox';
import { createContract } from '../utils/contract';
import { getTerm, getTitle } from '../utils/metadata';
import { getProposalHistories } from '../utils/activities';
import { LOCAL_ABI } from '../utils/abi';
import { MINION_ACTION_FUNCTION_NAMES } from '../utils/proposalUtils';
import { transactionByProposalType } from '../utils/txHelpers';

const Proposal = ({
  activities,
  customTerms,
  daoProposals,
  daoMember,
  delegate,
  overview,
}) => {
  const { refreshDao } = useTX();
  const { propid, daochain, daoid } = useParams();

  const [minionAction, setMinionAction] = useState(null);
  const [hideMinionExecuteButton, setHideMinionExecuteButton] = useState(null);

  const currentProposal = activities
    ? activities?.proposals?.find(proposal => proposal.proposalId === propid)
    : null;

  const handleRefreshDao = () => {
    refreshDao();
  };

  useEffect(() => {
    const getMinionAction = async currentProposal => {
      try {
        const tx = transactionByProposalType(currentProposal);
        const abi = LOCAL_ABI[tx.contract.abiName];
        const web3Contract = createContract({
          address: currentProposal.minionAddress,
          abi,
          chainID: daochain,
        });
        const action = await web3Contract.methods[
          MINION_ACTION_FUNCTION_NAMES[tx.contract.abiName]
        ](currentProposal.proposalId).call();

        setMinionAction(action);

        // hides execute minion button on funding and payroll proposals
        if (action[1] === '0x0000000000000000000000000000000000000000') {
          setHideMinionExecuteButton(true);
        } else {
          setHideMinionExecuteButton(false);
        }
      } catch (err) {
        console.error('Error: getMinionAction', err);
      }
    };

    if (currentProposal && currentProposal.minion) {
      getMinionAction(currentProposal);
    }
  }, [currentProposal, daochain]);

  return (
    <MainViewLayout header='Proposal' customTerms={customTerms} isDao>
      <Box>
        <Flex wrap='wrap'>
          <Flex
            direction='column'
            w={['100%', null, null, null, '60%']}
            pr={[0, null, null, null, 6]}
          >
            <Link as={RouterLink} to={`/dao/${daochain}/${daoid}/proposals`}>
              <Flex align='center'>
                <Icon
                  name='arrow-back'
                  color='primary.50'
                  as={RiArrowLeftLine}
                  h='20px'
                  w='20px'
                  mr={2}
                />
                <TextBox
                  size={['sm', null, null, 'md']}
                  title={getTitle(customTerms, 'Proposals')}
                >
                  {`All ${getTerm(customTerms, 'proposals')}`}
                </TextBox>
              </Flex>
            </Link>
            <ProposalDetails
              proposal={currentProposal}
              daoMember={daoMember}
              overview={overview}
              hideMinionExecuteButton={hideMinionExecuteButton}
              minionAction={minionAction}
            />
          </Flex>
          <Flex
            direction='column'
            w={['100%', null, null, null, '40%']}
            pt={[6, 0]}
          >
            <Flex justifyContent='space-between'>
              {(!currentProposal?.cancelled || currentProposal?.escrow) && (
                <TextBox size='md'>Actions</TextBox>
              )}

              <IconButton
                icon={<RiRefreshLine size='1.5rem' />}
                p={0}
                size='sm'
                variant='outline'
                onClick={handleRefreshDao}
              />
            </Flex>
            <Stack pt={6} spacing={6}>
              {(!currentProposal?.cancelled || currentProposal?.escrow) && (
                <ProposalActions
                  proposal={currentProposal}
                  overview={overview}
                  daoMember={daoMember}
                  daoProposals={daoProposals}
                  delegate={delegate}
                  hideMinionExecuteButton={hideMinionExecuteButton}
                  minionAction={minionAction}
                />
              )}
              <ActivitiesFeed
                limit={6}
                activities={currentProposal}
                hydrateFn={getProposalHistories}
                isLink={false}
              />
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </MainViewLayout>
  );
};

export default Proposal;
