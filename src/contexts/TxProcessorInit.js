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
import { useTxProcessor, useUser, useWeb3Connect } from './PokemolContext';
import ExplorerLink from '../components/Shared/ExplorerLink';
import { truncateAddr } from '../utils/helpers';

const TxProcessorInit = () => {
  const [user] = useUser();
  const [web3Connect] = useWeb3Connect();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestTx, setLatestTx] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // tx is added to txprocessor list, 
    // force update is set to true from component callback
    // checks if anything is unseen in txprocessor list
    // condition 1
    // if there are unseen transaction, set latest transaction to be tracked
    // set loading
    // open modal
    // keep running as long as unseen list has some
    // ***
    // tocessor update is ran every block
    // update loops through all pending txs and checks it's status
    // if it has a block number and status it has completed and is set open: false, seen: true
    //
    // if there is no pending txs forceUpdate is set false and checks will not happen each block anymore
    // when forceupdate is changed useEffect will run again, dropping into condition 2
    // sets loading false and fires off toast

    // tx description, set to name now
    // probably need name and params

    if (!txProcessor) {
      return;
    }
    if (!user || Object.keys(txProcessor).length === 0) {
      return;
    }
    const unseen = txProcessor.getTxUnseenList(user.username);
    if (unseen.length) {
      // consdtion 1
      setLatestTx(unseen[0]);
      setLoading(true);
      onOpen();
    } else if (latestTx) {
      // condition 2
      // need to update state here
      setLatestTx(txProcessor.getTx(latestTx.tx, user.username));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, txProcessor.forceUpdate]);

  useEffect(() => {
    if (user && web3Connect.web3 && !txProcessor.web3) {
      initTxProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, web3Connect]);

  const initTxProcessor = async () => {
    const txProcessorService = new TxProcessorService(web3Connect.web3);
    txProcessorService.update(user.username);
    txProcessorService.forceUpdate =
      txProcessorService.getTxPendingList(user.username).length > 0;
    updateTxProcessor(txProcessorService);

    web3Connect.web3.eth.subscribe('newBlockHeaders', async (error, result) => {
      if (!error) {
        if (txProcessorService.forceUpdate) {
          await txProcessorService.update(user.username);
          if (!txProcessorService.getTxPendingList(user.username).length) {
            txProcessorService.forceUpdate = false;
          }
          updateTxProcessor(txProcessorService);
        }
      }
    });
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
          <ModalHeader>Transaction Submitted</ModalHeader>
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
