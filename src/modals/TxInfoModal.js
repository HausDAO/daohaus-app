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
  Flex,
} from '@chakra-ui/react';
import { rgba } from 'polished';
import {
  RiExternalLinkLine,
  RiInformationLine,
  RiLinksLine,
} from 'react-icons/ri';
import TextBox from '../components/TextBox';

import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { getLastTx } from '../utils/txData';
import { truncateAddr } from '../utils/general';
import ExplorerLink from '../components/explorerLink';

const TxInfoModal = () => {
  const { outstandingTXs } = useUser();
  const { txInfoModal, setTxInfoModal } = useOverlay();
  const { theme } = useCustomTheme();

  const latestTx = getLastTx(outstandingTXs);
  const handleClose = () => setTxInfoModal(false);

  return (
    <Modal isOpen={txInfoModal} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
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
        <ModalHeader p={2}>
          <Box
            fontFamily='heading'
            fontWeight={800}
            fontSize={['sm', null, null, 'md']}
          >
            {latestTx?.displayName || 'Transaction'}{' '}
            {latestTx?.status === 'resolved' ? 'Completed' : 'Submitted'}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={[3, null, null, 6]} pt={2}>
          <Stack spacing={4}>
            {latestTx && (
              <>
                <ExplorerLink
                  type='tx'
                  hash={latestTx.txHash}
                  chainID={latestTx.pollArgs.chainID}
                >
                  <Flex align='center'>
                    <Box
                      fontSize={['sm', null, null, 'md']}
                      fontFamily='mono'
                      fontWeight={500}
                      mr={3}
                    >
                      {truncateAddr(latestTx.txHash)}
                    </Box>
                    <Box
                      color='secondary.500'
                      fontSize={['sm', null, null, 'md']}
                      fontWeight={600}
                    >
                      view
                    </Box>
                    <Icon
                      as={RiExternalLinkLine}
                      color='secondary.500'
                      ml={2}
                    />
                  </Flex>
                </ExplorerLink>
                {latestTx.status === 'resolved' && (
                  <Box fontSize={['sm', null, null, 'md']}>
                    <Box as='span' role='img' aria-label='confetti' mr={2}>
                      🎉
                    </Box>
                    Success {latestTx.resolvedMsg}
                    <Box as='span' role='img' aria-label='confetti' ml={2}>
                      🎉
                    </Box>
                  </Box>
                )}
                {latestTx.header && (
                  <Heading fontSize={['lg', null, null, '2xl']} m={2}>
                    {latestTx.header}
                  </Heading>
                )}
                {latestTx?.bodyText && (
                  <List spacing={3}>
                    {latestTx?.bodyText.map((txt, idx) => (
                      <ListItem key={idx} fontSize={['sm', null, null, 'md']}>
                        <Icon as={RiInformationLine} /> {txt}
                      </ListItem>
                    ))}
                  </List>
                )}
                {latestTx?.links && (
                  <Box m={2}>
                    {latestTx?.links.length && (
                      <TextBox size='sm'>links:</TextBox>
                    )}
                    <Stack spacing={3} mt={2}>
                      {latestTx?.links.map((link, idx) =>
                        link.external ? (
                          <Flex align='center' key={`${link.href}-${link.idx}`}>
                            <Icon
                              as={RiLinksLine}
                              mr={2}
                              color='secondary.500'
                            />
                            <Box
                              as={Link}
                              href={link.href}
                              fontFamily='mono'
                              fontWeight={400}
                              fontSize={['sm', null, null, 'md']}
                              mt={0}
                            >
                              {link.text}
                            </Box>
                            <Icon
                              as={RiExternalLinkLine}
                              color='secondary.500'
                              ml={2}
                            />
                          </Flex>
                        ) : (
                          <Flex align='center' key={`${link.href}-${link.idx}`}>
                            <Icon
                              as={RiLinksLine}
                              mr={2}
                              color='secondary.500'
                            />
                            <Box
                              as={RouterLink}
                              to={link.href}
                              fontFamily='mono'
                              fontWeight={400}
                              fontSize={('sm', null, null, 'md')}
                            >
                              {link.text}
                            </Box>
                          </Flex>
                        ),
                      )}
                    </Stack>
                  </Box>
                )}
              </>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TxInfoModal;
