import React, { useEffect, useState } from 'react';
import { RiArrowLeftLine, RiRefreshLine } from 'react-icons/ri';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Stack, Link, Icon, IconButton } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import ActivitiesFeed from '../components/activitiesFeed';
import MainViewLayout from '../components/mainViewLayout';
import ProposalActions from '../components/proposalActions';
import ProposalDetails from '../components/proposalDetails';
import TextBox from '../components/TextBox';
import { createContract } from '../utils/contract';
import { getProposalHistories } from '../utils/activities';
import { getTerm, getTitle } from '../utils/metadata';
import { getMinionAbi } from '../utils/abi';
import { MINION_ACTION_FUNCTION_NAMES } from '../utils/minionUtils';
import { fetchSingleProposal } from '../utils/theGraph';
import { proposalResolver } from '../utils/resolvers';

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
  const [currentProposal, setCurrentProposal] = useState(null);

  useEffect(() => {
    const setUpProposal = async () => {
      const prop = activities.proposals?.find(
        proposal => proposal.proposalId === propid,
      );

      if (!prop) {
        const res = await fetchSingleProposal({
          chainID: daochain,
          molochAddress: daoid,
          proposalId: propid,
        });

        if (res.proposals[0]) {
          setCurrentProposal(
            proposalResolver(res.proposals[0], {
              status: true,
              title: true,
              description: true,
              link: true,
              hash: true,
              proposalType: true,
            }),
          );
        }
      } else {
        setCurrentProposal(prop);
      }
    };
    if (activities && propid.match(/^\d+$/)) {
      setUpProposal();
    }
  }, [activities, propid]);

  const handleRefreshDao = () => {
    const skipVaults = true;
    refreshDao(skipVaults);
  };

  useEffect(() => {
    const getMinionAction = async currentProposal => {
      try {
        const { minionType, safeMinionVersion } = currentProposal.minion;
        const abi = getMinionAbi(minionType, safeMinionVersion || '1');
        const web3Contract = createContract({
          address: currentProposal.minionAddress,
          abi,
          chainID: daochain,
        });

        const actionName = MINION_ACTION_FUNCTION_NAMES[minionType];
        const action = await web3Contract.methods[actionName](
          currentProposal.proposalId,
        ).call();

        setMinionAction(action);

        // hides execute minion button on funding and payroll proposals, & executed action on safe minion
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
