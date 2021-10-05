import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import {
  RiExternalLinkLine,
  RiInformationLine,
  RiCheckLine,
} from 'react-icons/ri';
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
  Spinner,
  Stack,
  Flex,
  Text,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import ExplorerLink from '../components/explorerLink';
import TextBox from '../components/TextBox';
import { getLastTx } from '../utils/txData';

const TxInfoModal = () => {
  const { outstandingTXs } = useUser();
  const { txInfoModal, setTxInfoModal } = useOverlay();
  const { theme } = useCustomTheme();

  const latestTx = getLastTx(outstandingTXs);
  const handleClose = () => setTxInfoModal(false);

  return (
    <Modal isOpen={txInfoModal} onClose={handleClose} isCentered>
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent
        rounded='lg'
        bg='background.600'
        borderWidth='1px'
        borderColor='white'
        fontFamily='heading'
        p={6}
        pt={1}
      >
        <ModalHeader p={2}>
          <Box
            fontFamily='heading'
            fontWeight={700}
            fontSize={['sm', null, null, 'md']}
          >
            {latestTx?.displayName || 'Transaction'}
            {latestTx?.status === 'resolved' ? ' Completed' : ' Submitted'}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            {latestTx && (
              <>
                {latestTx.status !== 'resolved' && (
                  <Flex direction='column' align='center' my={6}>
                    <Spinner size='xl' color='secondary.500' />
                    <Text fontSize='xs' pt={3}>
                      Processing ...
                    </Text>
                  </Flex>
                )}
                {latestTx.status === 'resolved' && (
                  <Flex align='center' direction='column' w='100%' my={6}>
                    <Box
                      style={{
                        width: '48px',
                        height: '48px',
                        padding: '6px',
                        borderRadius: '50%',
                        border: `2px solid ${theme.colors.whiteAlpha[900]}`,
                      }}
                    >
                      <RiCheckLine
                        style={{
                          width: '36px',
                          height: '36px',
                          color: theme.colors.whiteAlpha[900],
                        }}
                      />
                    </Box>
                    <Text fontSize='xs' pt={3}>
                      Confirmed
                    </Text>
                  </Flex>
                )}
                <ExplorerLink
                  type='tx'
                  hash={latestTx.txHash}
                  chainID={latestTx.pollArgs.chainID}
                >
                  <Flex justify='center' w='100%'>
                    <Box
                      color='secondary.500'
                      fontSize={['xs', null, null, 'sm']}
                      fontWeight={600}
                      textAlign='center'
                    >
                      Watch Transaction
                    </Box>
                    <Icon
                      as={RiExternalLinkLine}
                      color='secondary.500'
                      ml={2}
                      mb='-2px'
                    />
                  </Flex>
                </ExplorerLink>
                <Box
                  mb={3}
                  style={{
                    height: '1px',
                    width: '100%',
                    background: theme.colors.whiteAlpha[300],
                  }}
                />
                {latestTx.header && (
                  <Heading fontSize={['sm', null, null, 'md']}>
                    {latestTx.header}
                  </Heading>
                )}
                {latestTx?.bodyText ? (
                  <List spacing={3}>
                    {latestTx?.bodyText.map((txt, idx) => (
                      <ListItem
                        as={Box}
                        key={idx}
                        fontSize={['xs', null, null, 'sm']}
                        d='flex'
                        flexDirection='row'
                        alignItems='start'
                        justify='center'
                      >
                        <Icon
                          as={RiInformationLine}
                          color='primary.200'
                          mr={2}
                          mt={1}
                        />
                        {txt}
                      </ListItem>
                    ))}
                  </List>
                ) : null}
                {latestTx?.links ? (
                  <Box m={2}>
                    {latestTx?.links.length && (
                      <TextBox size='sm'>Links</TextBox>
                    )}
                    <Stack spacing={3} mt={2}>
                      {/* {latestTx?.links?.length > 0 && (
                        latestTx?.links.map((link, idx) => (
                          link.external ? (
                            <Flex
                              align='center'
                              key={`${link?.href}-${link?.idx}`}
                            >
                              <Icon
                                as={RiLinksLine}
                                mr={2}
                                color='primary.200'
                              />
                              <Box
                                as={Link}
                                href={link?.href}
                                fontWeight={400}
                                fontSize={['xs', null, null, 'sm']}
                                mt={0}
                              >
                                {link?.text}
                              </Box>
                              <Icon
                                as={RiExternalLinkLine}
                                color='secondary.500'
                                ml={2}
                              />
                            </Flex>
                          ) : (
                            <Flex
                              align='center'
                              key={`${link?.href}-${link?.idx}`}
                            >
                              <Icon
                                as={RiLinksLine}
                                mr={2}
                                color='secondary.500'
                              />
                              <Box
                                as={RouterLink}
                                to={link?.href}
                                fontFamily='mono'
                                fontWeight={400}
                                fontSize={('sm', null, null, 'md')}
                              >
                                {link?.text}
                              </Box>
                            </Flex>
                          )
                        )))} */}
                    </Stack>
                  </Box>
                ) : null}
              </>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TxInfoModal;
