import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Icon,
  Heading,
  List,
  ListItem,
  Link,
  Stack,
} from '@chakra-ui/react';
import { VscQuestion } from 'react-icons/vsc';
import { RiExternalLinkLine, RiErrorWarningLine } from 'react-icons/ri';
import TextBox from '../components/TextBox';

import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { getLastTx } from '../utils/txData';
import { truncateAddr } from '../utils/general';
import ExplorerLink from '../components/explorerLink';

const TxInfoModal = () => {
  const { outstandingTXs } = useUser();
  const { txInfoModal, setTxInfoModal } = useOverlay();

  const latestTx = getLastTx(outstandingTXs);
  const handleClose = () => setTxInfoModal(false);

  return (
    <Modal isOpen={txInfoModal} onClose={handleClose}>
      <ModalOverlay bgColor='background.400' />
      <ModalContent
        rounded='lg'
        bg='background.600'
        borderWidth='1px'
        borderColor='white'
        fontFamily='heading'
        p={6}
        m={6}
        mt={2}
      >
        <ModalHeader>
          {latestTx?.displayName || 'Transaction'}{' '}
          {latestTx?.status === 'resolved' ? 'Completed' : 'Submitted'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {latestTx && (
            <>
              <ExplorerLink
                type='tx'
                hash={latestTx.txHash}
                chainID={latestTx.pollArgs.chainID}
              >
                <TextBox>{truncateAddr(latestTx.txHash)}</TextBox>{' '}
                <TextBox colorScheme='secondary.500' size='sm'>
                  view
                </TextBox>{' '}
                <Icon as={RiExternalLinkLine} color='secondary.500' ml={1} />
              </ExplorerLink>
              {latestTx.status === 'resolved' && (
                <Box mt={4}>
                  <span role='img' aria-label='confetti'>
                    🎉
                  </span>{' '}
                  Success {latestTx.resolvedMsg}
                  {''}
                  <span role='img' aria-label='confetti'>
                    🎉
                  </span>
                  {/* {latestTx && latestTx?.action === 'summonMoloch' && (
                    <Button onClick={openDaoRegisterRoute}>
                      Configure DAO
                    </Button>
                  )} */}
                </Box>
              )}
              {latestTx.header && (
                <Heading as='h5' m={2}>
                  {latestTx.header}
                </Heading>
              )}
              {latestTx?.bodyText && (
                <List spacing={3}>
                  {latestTx?.bodyText.map((txt, idx) => (
                    <ListItem key={idx}>
                      <Icon as={VscQuestion} /> {txt}
                    </ListItem>
                  ))}
                </List>
              )}
              {latestTx?.links && (
                <Box m={2}>
                  {latestTx?.links.length && (
                    <TextBox size='sm'>links:</TextBox>
                  )}
                  <Stack spacing='4px'>
                    {latestTx?.links.map((link, idx) =>
                      link.external ? (
                        <TextBox
                          as={Link}
                          key={`${link.href}-${link.idx}`}
                          href={link.href}
                        >
                          {link.text}
                        </TextBox>
                      ) : (
                        <TextBox
                          as={RouterLink}
                          key={`${link.href}-${link.idx}`}
                          to={link.href}
                        >
                          {link.text} <Icon as={RiErrorWarningLine} />
                        </TextBox>
                      ),
                    )}
                  </Stack>
                </Box>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TxInfoModal;
