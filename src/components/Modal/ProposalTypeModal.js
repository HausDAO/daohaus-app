import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Text,
  Flex,
  Image,
  Box,
} from '@chakra-ui/core';
import { useTheme } from '../../contexts/PokemolContext';

const ProposalFormModal = ({ isOpen, setShowModal, setProposalType }) => {
  const [theme] = useTheme();

  const proposalTypes = [
    {
      name: 'Apply',
      subhead: 'Join the guild!',
      proposalType: 'member-proposal',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Funding',
      subhead: 'Request funds',
      proposalType: 'funding-proposal',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Token',
      subhead: 'Whitelist a token',
      proposalType: 'token-proposal',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${theme.daoMeta.member}`,
      proposalType: 'kick-proposal',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Trade',
      subhead: 'Trade funds',
      proposalType: 'trade-proposal',
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
          <Text
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
            color='white'
          >
            New {theme.daoMeta.proposal}
          </Text>
          <Text
            fontFamily={theme.fonts.heading}
            fontSize='2xl'
            fontWeight={700}
            color='white'
          >
            Select Proposal Type
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          flexDirection='row'
          display='flex'
          justify='space-around'
          width='auto'
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
                w='170px'
                h='200px'
                m={2}
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
                <Text
                  mb={2}
                  fontSize='md'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                  color='white'
                >
                  {p.name}
                </Text>
                <Text
                  fontSize='sm'
                  fontFamily={theme.fonts.heading}
                  color='white'
                >
                  {p.subhead}
                </Text>
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
