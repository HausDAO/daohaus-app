import React from 'react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { getLastTx } from '../utils/txData';

const TxInfoModal = () => {
  const { outstandingTXs } = useUser();
  const { address } = useInjectedProvider();
  const { txInfoModal, setTxInfoModal } = useOverlay();

  const mostRecentTx = getLastTx(outstandingTXs, address);
  const isLoading = mostRecentTx?.status === 'unresolved';
  clg;
  const handleClose = () => setTxInfoModal(false);
  return (
    <Modal isOpen={txInfoModal} onClose={handleClose}>
      <ModalOverlay />
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
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {latestTx && (
            <>
              <ExplorerLink type='tx' hash={latestTx.tx}>
                <TextBox>{truncateAddr(latestTx.tx)}</TextBox>{' '}
                <TextBox colorScheme='secondary.500' size='sm'>
                  view
                </TextBox>{' '}
                <Icon as={RiExternalLinkLine} color='secondary.500' ml={1} />
              </ExplorerLink>
              {!loading && (
                <Box mt={4}>
                  <span role='img' aria-label='confetti'>
                    🎉
                  </span>{' '}
                  Success{' '}
                  {(latestTx && DISPLAY_NAMES[latestTx?.details?.name]) || ''}{' '}
                  <span role='img' aria-label='confetti'>
                    🎉
                  </span>
                  {latestTx && latestTx?.details?.name === 'summonMoloch' && (
                    <Button onClick={openDaoRegisterRoute}>
                      Configure DAO
                    </Button>
                  )}
                </Box>
              )}
              {POPUP_CONTENT[latestTx?.details?.name]?.header && (
                <Heading as='h5' m={2}>
                  {POPUP_CONTENT[latestTx?.details?.name]?.header}
                </Heading>
              )}
              {POPUP_CONTENT[latestTx?.details?.name]?.bodyText && (
                <List spacing={3}>
                  {POPUP_CONTENT[latestTx?.details?.name]?.bodyText.map(
                    (txt, idx) => (
                      <ListItem key={idx}>
                        <Icon as={VscQuestion} /> {txt}
                      </ListItem>
                    ),
                  )}
                </List>
              )}
              {POPUP_CONTENT[latestTx?.details?.name]?.links && (
                <Box m={2}>
                  {POPUP_CONTENT[latestTx?.details?.name]?.links.length && (
                    <TextBox size='sm'>links:</TextBox>
                  )}
                  <Stack spacing='4px'>
                    {POPUP_CONTENT[latestTx?.details?.name]?.links.map(
                      (link, idx) =>
                        link.external ? (
                          <TextBox as={Link} key={idx} href={link.href}>
                            {link.text}
                          </TextBox>
                        ) : (
                          <TextBox as={RouterLink} key={idx} to={link.href}>
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
