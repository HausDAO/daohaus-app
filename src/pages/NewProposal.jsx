import React, { useEffect, useState } from 'react';
import { Flex, Box, Image } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';

import ProposalModal from '../modals/proposalModal';
import { proposalTypes } from '../content/proposal-types';
import { useOverlay } from '../contexts/OverlayContext';
import { getTerm } from '../utils/metadata';
import ComingSoonOverlay from '../components/comingSoonOverlay';
import MainViewLayout from '../components/mainViewLayout';

const validProposalType = type => {
  return [
    'member',
    'funding',
    'whitelist',
    'guildkick',
    'trade',
    'lootgrab',
    'minion',
    'superfluidMinion',
    'transmutation',
  ].includes(type);
};

const ProposalScopedModals = ({ proposalType }) => (
  <ProposalModal proposalType={proposalType} />
);

const NewProposal = ({ customTerms, daoMetaData, daoOverview }) => {
  const params = useParams();
  const history = useHistory();
  const [proposalType, setProposalType] = useState(null);
  const [activeProposalTypes, setActiveProposalTypes] = useState();

  const { setProposalModal } = useOverlay();

  useEffect(() => {
    if (params.proposalType) {
      if (validProposalType(params.proposalType)) {
        setProposalType(params.proposalType);
        setProposalModal(true);
      } else {
        history.push(`/dao/${params.daochain}/${params.daoid}/proposals`);
      }
    }
  }, [params?.proposalType]);

  useEffect(() => {
    if (daoMetaData?.boosts?.proposalTypes?.active) {
      proposalTypes(customTerms, daoMetaData?.boosts, daoOverview?.minions);
    }
    setActiveProposalTypes(
      proposalTypes(customTerms, daoMetaData?.boosts, daoOverview?.minions),
    );
  }, [customTerms, daoMetaData, daoOverview]);

  return (
    <MainViewLayout header={`New ${getTerm(customTerms, 'Proposal')}`} isDao>
      <Box>
        <ProposalScopedModals proposalType={proposalType} />
        <Flex>
          <TextBox size={['md', null, null, 'xl']} fontWeight={700}>
            {`Select ${getTerm(customTerms, 'proposal')} Type`}
          </TextBox>
        </Flex>

        <ContentBox mt={6}>
          <Flex
            flexDirection='row'
            flexWrap='wrap'
            justify='space-around'
            align='center'
          >
            {activeProposalTypes?.map(p => {
              return (
                p.show && (
                  <Box
                    position='relative'
                    as={Flex}
                    key={p.name}
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    _hover={{
                      border: '1px solid #7579C5',
                      cursor: 'pointer',
                    }}
                    border='1px solid transparent'
                    minW='160px'
                    h='200px'
                    p={2}
                    m={1}
                    onClick={() => {
                      // if (p.comingSoon) {
                      //   return;
                      // }
                      setProposalType(p.proposalType);
                      setProposalModal(true);
                    }}
                  >
                    {p.comingSoon && <ComingSoonOverlay />}
                    <Image src={p.image} width='50px' mb={15} />
                    <Box
                      fontSize='md'
                      fontFamily='heading'
                      fontWeight={700}
                      color='white'
                    >
                      {p.name}
                    </Box>
                    <Box
                      fontSize='xs'
                      fontFamily='heading'
                      color='white'
                      textAlign='center'
                      maxW='150px'
                    >
                      {p.subhead}
                    </Box>
                  </Box>
                )
              );
            })}
          </Flex>
        </ContentBox>
      </Box>
    </MainViewLayout>
  );
};

export default NewProposal;
