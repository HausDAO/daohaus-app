import React, { useEffect, useState } from 'react';

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Text,
  Icon,
  Heading,
} from '@chakra-ui/react';

import { TxProcessorService } from '../utils/tx-processor-service';
import {
  useMembers,
  useProposals,
  useRefetchQuery,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from './PokemolContext';
import ExplorerLink from '../components/Shared/ExplorerLink';
import { truncateAddr } from '../utils/helpers';
import {
  DISPLAY_NAMES,
  TX_CONTEXTS,
  POPUP_CONTENT,
} from '../utils/tx-processor-helper';
import { mutateMember } from '../utils/proposal-mutations';
import { Link } from 'react-router-dom';
import { RiErrorWarningLine } from 'react-icons/ri';

const TxProcessorInit = () => {
  const [, updateRefetchQuery] = useRefetchQuery();

  const [user] = useUser();
  const [web3Connect] = useWeb3Connect();
  const [proposals] = useProposals();
  const [members, updateMembers] = useMembers();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestTx, setLatestTx] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    /*
    This runs after txProcessor.forupdate 
    or txProcessor.forceCheckTx has been changed
    checks for unseen in the list
    will open the transaction submitted popup
    */
    if (!txProcessor) {
      return;
    }
    if (!user || Object.keys(txProcessor).length === 0) {
      return;
    }
    const unseen = txProcessor.getTxUnseenList(user.username);
    // open popup for first unseen and mark as seen
    if (unseen.length) {
      txProcessor.seeTransaction(unseen[0].tx, user.username);
      setLatestTx(unseen[0]);
      setLoading(true);
      onOpen();
    }
    // eslint-disable-next-line
  }, [txProcessor.forceUpdate, txProcessor.forceCheckTx]);

  useEffect(() => {
    /*
    This runs after txProcessor.forceCheckTx has been changed
    is set after every non proposal web3 transaction
    will open the toast to show completion
    */
    if (!txProcessor) {
      return;
    }
    if (!user || Object.keys(txProcessor).length === 0) {
      return;
    }

    const pending = txProcessor.getTxPendingList(user.username);

    if (!txProcessor.forceCheckTx && !pending.length && latestTx) {
      // optimistic mutation
      const context = TX_CONTEXTS.find(
        (item) => item.methods.indexOf(latestTx.details.name) > -1,
      );
      console.log('context', context);
      console.log('latestTx', latestTx);
      if (context?.name === 'members') {
        const newMembers = mutateMember(members, latestTx.details);
        console.log(newMembers);
        updateMembers([...newMembers]);
      }
      toast({
        title: 'Transaction away',
        position: 'top-right',
        description: `transaction success ${
          DISPLAY_NAMES[latestTx.details.name]
        }`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }

    // eslint-disable-next-line
  }, [txProcessor.forceCheckTx]);

  useEffect(() => {
    /*
    after proposals is updated 
    check for pending transactions in tx processor
    propsals are refetched from graph by the interval set in initTxProcessor
    */
    if (!txProcessor) {
      return;
    }
    if (!user || Object.keys(txProcessor).length === 0) {
      return;
    }
    const graphStatus = txProcessor.getTxPendingGraphList(user.username);
    if (graphStatus.length) {
      txProcessor.updateGraphStatus(user.username, proposals);
      const newGraphStatus = txProcessor.getTxPendingGraphList(user.username);
      const tx = txProcessor.getTx(graphStatus[0].tx, user.username);

      // if length is 0 then set forUpdate back to false
      if (!newGraphStatus.length) {
        txProcessor.forceUpdate = false;
        updateTxProcessor({ ...txProcessor });
      }
      // if pending length is different after update it is finished
      // TODO: for process proposal we should refetch members and dao too
      // TODO: for yes vote we should refetch members for highestvotedindex
      if (graphStatus.length > newGraphStatus.length) {
        setLatestTx(tx);
        setLoading(false);
        toast({
          title: 'Transaction away',
          position: 'top-right',
          description: `transaction success ${DISPLAY_NAMES[tx.details.name]}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, proposals]);

  useEffect(() => {
    /*
    load new txProcessor and save to context

    set a interval that runs and if any pending graph update on proposals
    polls proposals from graph
    */
    if (user && web3Connect.web3 && !txProcessor.web3) {
      initTxProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, web3Connect]);

  const initTxProcessor = async () => {
    const txProcessorService = new TxProcessorService(web3Connect.web3);
    // txProcessorService.update(user.username);
    txProcessorService.forceUpdate =
      txProcessorService.getTxPendingGraphList(user.username).length > 0;
    txProcessorService.forceCheckTx =
      txProcessorService.getTxPendingList(user.username).length > 0;
    updateTxProcessor({ ...txProcessorService });

    const interval = setInterval(async () => {
      if (txProcessorService.getTxPendingGraphList(user.username).length) {
        updateRefetchQuery('proposals');
      }
    }, 3000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    /*
    when txProcessor is loaded sub to blocks
    forceCheckTx is set from component running tx
    if forceCheckTx check the pending transaction in list
    if all have mined set forceCheckTx to false triggering useEffect
    */
    if (!txProcessor) {
      return;
    }
    if (!user || Object.keys(txProcessor).length === 0) {
      return;
    }
    web3Connect.web3.eth.subscribe('newBlockHeaders', async (error, result) => {
      if (!error) {
        if (txProcessor.forceCheckTx) {
          setLatestTx(txProcessor.getTxPendingList(user.username)[0]);
          setLoading(true);
          await txProcessor.update(user.username);
          if (!txProcessor.getTxPendingList(user.username).length) {
            txProcessor.forceCheckTx = false;
            updateTxProcessor({ ...txProcessor });
          }
        }
      }
    });
    // eslint-disable-next-line
  }, [txProcessor.loaded]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setLoading(false);
          onClose();
        }}
      >
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
          <ModalHeader>
            {(latestTx && DISPLAY_NAMES[latestTx?.details?.name]) ||
              'Transaction'}{' '}
            {loading ? 'Submitted' : 'Completed'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {latestTx && (
              <>
                <ExplorerLink
                  type='tx'
                  hash={latestTx.tx}
                  linkText={`${truncateAddr(latestTx.tx)} view`}
                />
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
                  </Box>
                )}
                {POPUP_CONTENT[latestTx?.details?.name]?.header && (
                  <Heading>
                    {POPUP_CONTENT[latestTx?.details?.name]?.header}
                  </Heading>
                )}
                {POPUP_CONTENT[latestTx?.details?.name]?.bodyText.map(
                  (txt, idx) => (
                    <Text key={idx}>{txt}</Text>
                  ),
                )}
                {POPUP_CONTENT[latestTx?.details?.name]?.links.length && (
                  <Text>links:</Text>
                )}
                {POPUP_CONTENT[latestTx?.details?.name]?.links.map(
                  (link, idx) =>
                    link.external ? (
                      <Link key={idx} to={link.href}>
                        {link.text}
                      </Link>
                    ) : (
                      <Link key={idx} to={link.href}>
                        {link.text} <Icon as={RiErrorWarningLine} />
                      </Link>
                    ),
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TxProcessorInit;
