import React, { useEffect, useState } from 'react';
import { Flex, Box, Image } from '@chakra-ui/react';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { useHistory, useParams } from 'react-router-dom';

import ProposalFormModal from '../../components/Modal/ProposalFormModal';
import ComingSoonOverlay from '../../components/Shared/ComingSoonOverlay';
import { proposalTypes } from '../../content/proposal-types';
import { useTheme } from '../../contexts/CustomThemeContext';
import { useDao } from '../../contexts/PokemolContext';

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

const NewProposal = () => {
  const [dao] = useDao();
  const [theme] = useTheme();
  const params = useParams();
  const history = useHistory();
  const [proposalType, setProposalType] = useState(null);
  const [, setProposal] = useState(null);
  const [showModal, setShowModal] = useState();

  useEffect(() => {
    if (params.type) {
      if (validProposalType(params.type)) {
        setShowModal('proposal');
        setProposalType(params.type);
      } else {
        history.push(`/dao/${params.dao}/proposals`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Box p={6}>
      <Flex>
        <TextBox fontSize='xl' fontWeight={700}>
          Select a Proposal Type
        </TextBox>
      </Flex>

      <ContentBox mt={6}>
        <Flex
          flexDirection='row'
          flexWrap='wrap'
          justify='space-around'
          align='center'
        >
          {proposalTypes(theme).map((p) => {
            return (
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
                  if (p.comingSoon) {
                    return;
                  }
                  setProposalType(p.proposalType);
                  setShowModal('proposal');
                }}
              >
                {p.comingSoon && <ComingSoonOverlay />}
                <Image
                  src={require('../../assets/' + p.image)}
                  width='50px'
                  mb={15}
                />
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
            );
          })}
        </Flex>
      </ContentBox>

      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={showModal === 'proposal'}
        setShowModal={setShowModal}
        proposalType={proposalType}
        returnRoute={`/dao/${dao?.address}/proposals/new`}
      />
    </Box>
  );
};

export default NewProposal;
