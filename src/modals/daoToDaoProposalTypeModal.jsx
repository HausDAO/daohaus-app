import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react';
import { rgba } from 'polished';
import TextBox from '../components/TextBox';
// import { useHistory, useParams } from 'react-router-dom';

import { daoToDaoProposalTypes } from '../content/proposal-types';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useOverlay } from '../contexts/OverlayContext';
// import { useModals } from '../../contexts/PokemolContext';

// const validProposalType = (type) => {
//   return [
//     'd2dStake',
//     'd2dVote',
//     'd2dDelegate',
//     'd2dRageQuit',
//     'd2dDistroRewards',
//   ].includes(type);
// };

const DaoToDaoProposalTypeModal = ({ setProposalType }) => {
  const { theme } = useCustomTheme();
  // const params = useParams();
  // const history = useHistory();
  // const { modals, openModal, closeModals } = useModals();
  const {
    d2dProposalTypeModal,
    setD2dProposalTypeModal,
    setD2dProposalModal,
  } = useOverlay();
  // useEffect(() => {
  //   if (params.type) {
  //     if (validProposalType(params.type)) {
  //       openModal('proposal');
  //       setProposalType(params.type);
  //     } else {
  //       history.push(`/dao/${params.dao}/proposals`);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params]);

  const handleClose = () => {
    setD2dProposalTypeModal(prevState => !prevState);
  };

  return (
    <Modal
      isOpen={d2dProposalTypeModal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth='500px'
      >
        <ModalHeader>
          <Flex align='center' justify='space-between'>
            <TextBox size='xl' fontWeight={700}>
              Select UBERQuest Type
            </TextBox>
            <ModalCloseButton />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Flex
            flexDirection='row'
            flexWrap='wrap'
            justify='space-around'
            align='center'
          >
            {daoToDaoProposalTypes().map(p => {
              return (
                p?.show && (
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
                      setD2dProposalModal(prevState => !prevState);
                      setD2dProposalTypeModal(prevState => !prevState);
                    }}
                  >
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
                      maxW='95%'
                    >
                      {p.subhead}
                    </Box>
                  </Box>
                )
              );
            })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DaoToDaoProposalTypeModal;
