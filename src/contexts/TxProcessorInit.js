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
} from '@chakra-ui/core';

import { TxProcessorService } from '../utils/tx-processor-service';
import {
  useProposals,
  useRefetchQuery,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from './PokemolContext';
import ExplorerLink from '../components/Shared/ExplorerLink';
import { truncateAddr } from '../utils/helpers';

const TxProcessorInit = () => {
  const [, updateRefetchQuery] = useRefetchQuery();

  const [user] = useUser();
  const [web3Connect] = useWeb3Connect();
  const [proposals] = useProposals();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestTx, setLatestTx] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    /*
    This runs after txProcessor.forupdate has been changed
    is set after every web3 transaction is run and on initial load
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
      // consdtion 1
      txProcessor.seeTransaction(unseen[0].tx, user.username);
      setLatestTx(unseen[0]);
      setLoading(true);
      onOpen();
    }
    // eslint-disable-next-line
  }, [txProcessor]);

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

      if (graphStatus.length > newGraphStatus.length) {
        setLatestTx(tx);
        setLoading(false);
        toast({
          title: 'Transaction away',
          position: 'top-right',
          description: 'transaction success',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, proposals]);

  useEffect(() => {
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
    updateTxProcessor({ ...txProcessorService });

    const interval = setInterval(async () => {
      if (txProcessorService.getTxPendingGraphList(user.username).length) {
        updateRefetchQuery('proposals');
      }
    }, 3000);
    return () => clearInterval(interval);

    // web3Connect.web3.eth.subscribe('newBlockHeaders', async (error, result) => {
    //   if (!error) {
    //     if (txProcessorService.forceUpdate) {
    //       await txProcessorService.update(user.username);
    //       if (!txProcessorService.getTxPendingList(user.username).length) {
    //         txProcessorService.forceUpdate = false;
    //         updateTxProcessor(txProcessorService);
    //       }
    //     }
    //   }
    // });
  };

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
            Transaction {loading ? 'Submitted' : 'Completed'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {latestTx && (
              <ExplorerLink
                type='tx'
                hash={latestTx.tx}
                linkText={`${truncateAddr(latestTx.tx)} view`}
              />
            )}
            {!loading && (
              <Box mt={4}>
                <span role='img' aria-label='confetti'>
                  🎉
                </span>{' '}
                Success{' '}
                <span role='img' aria-label='confetti'>
                  🎉
                </span>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TxProcessorInit;
