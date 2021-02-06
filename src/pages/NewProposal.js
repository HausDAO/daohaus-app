import React, { useEffect, useState } from 'react';
import { Flex, Box, Image } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';

import ProposalModal from '../modals/proposalModal';
// import ComingSoonOverlay from '../../components/Shared/ComingSoonOverlay';
import { proposalTypes } from '../content/proposal-types';
import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import { getCopy } from '../utils/metadata';
import ComingSoonOverlay from '../components/comingSoonOverlay';
// import { setProposalModal } from '../contexts/OverlayContext';
// import { useDao } from '../contexts/DaoContext';

const validProposalType = (type) => {
  return [
    'member',
    'funding',
    'whitelist',
    'guildkick',
    'trade',
    'minion',
    'transmutation',
  ].includes(type);
};

const ProposalScopedModals = ({ proposalType }) => (
  <>
    <ProposalModal proposalType={proposalType} />
  </>
);

const NewProposal = () => {
  const { customTerms, daoMetaData } = useMetaData();
  const params = useParams();
  const history = useHistory();
  const [proposalType, setProposalType] = useState(null);

  // const [, setProposal] = useState(null);
  const { setProposalModal } = useOverlay();
  // const { modals, openModal } = useModals();

  useEffect(() => {
    if (params.type) {
      if (validProposalType(params.type)) {
        // openModal('proposal');
        setProposalType(params.type);
        console.log(params.type);
      } else {
        history.push(`/dao/${params.dao}/proposals`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Box>
      <ProposalScopedModals proposalType={proposalType} />
      <Flex>
        <TextBox size='xl' fontWeight={700}>
          Select {getCopy(customTerms, 'proposal')} Type
        </TextBox>
      </Flex>

      <ContentBox mt={6}>
        <Flex
          flexDirection='row'
          flexWrap='wrap'
          justify='space-around'
          align='center'
        >
          {proposalTypes(customTerms, daoMetaData?.boosts)?.map((p) => {
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
                  _hover={{ border: '1px solid #7579C5', cursor: 'pointer' }}
                  w='160px'
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
  );
};

export default NewProposal;
