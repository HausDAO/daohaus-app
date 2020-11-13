import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Flex,
  Image,
  Box,
} from '@chakra-ui/core';
import { useTheme } from '../../contexts/CustomThemeContext';

const ProposalFormModal = ({ isOpen, setShowModal, setProposalType }) => {
  const [theme] = useTheme();

  const proposalTypes = [
    {
      name: 'Apply',
      subhead: 'Join the guild!',
      proposalType: 'member',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Funding',
      subhead: 'Request funds',
      proposalType: 'funding',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Token',
      subhead: 'Whitelist a token',
      proposalType: 'whitelist',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${theme.daoMeta.member}`,
      proposalType: 'guildkick',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Trade',
      subhead: 'Trade funds',
      proposalType: 'trade',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setShowModal(null)}
      isCentered
      size='xl'
    >
      <ModalOverlay />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
      >
        <ModalHeader>
          <Box
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
            color='white'
          >
            New {theme.daoMeta.proposal}
          </Box>
          <Box
            fontFamily='heading'
            fontSize='2xl'
            fontWeight={700}
            color='white'
          >
            Select Proposal Type
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          flexDirection='row'
          display='flex'
          flexWrap='wrap'
          justify='space-around'
          align='center'
        >
          {proposalTypes.map((p) => {
            return (
              <Box
                as={Flex}
                key={p.name}
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='space-evenly'
                _hover={{ border: '1px solid #7579C5', cursor: 'pointer' }}
                w='160px'
                h='200px'
                p={2}
                m={1}
                onClick={() => {
                  setProposalType(p.proposalType);
                  setShowModal('proposal');
                }}
              >
                <Image
                  src={require('../../assets/' + p.image)}
                  width='50px'
                  mb={15}
                />
                <Box
                  mb={2}
                  fontSize='md'
                  fontFamily='heading'
                  fontWeight={700}
                  color='white'
                >
                  {p.name}
                </Box>
                <Box fontSize='xs' fontFamily='heading' color='white'>
                  {p.subhead}
                </Box>
              </Box>
            );
          })}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
