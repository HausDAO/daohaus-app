import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import {
  useModals,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { MinionService } from '../../utils/minion-service';
import abiDecoder from 'abi-decoder';
import AddressAvatar from '../Shared/AddressAvatar';

const ProposalMinionCard = ({ proposal }) => {
  const [minionDeets, setMinionDeets] = useState();
  const [decodedData, setDecodedData] = useState();
  const [loading, setLoading] = useState(true);
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const { modals, openModal, closeModals } = useModals();

  useEffect(() => {
    let action;
    const getMinionDeets = async () => {
      const setupValues = {
        minion: proposal.minionAddress,
      };
      const minionService = new MinionService(
        web3Connect?.web3,
        user?.username,
        setupValues,
      );

      try {
        action = await minionService.getAction(proposal.proposalId);
      } catch (err) {
        console.log('error: ', err);
      } finally {
        setLoading(false);
      }

      setMinionDeets(action);
    };
    if (proposal?.proposalId) {
      getMinionDeets();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, user]);

  useEffect(() => {
    if (!minionDeets) {
      return;
    }
    const getAbi = async () => {
      try {
        const url = `https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=${minionDeets.to}`;
        const response = await fetch(url);
        const json = await response.json();
        abiDecoder.addABI(JSON.parse(json.result));
        const _decodedData = abiDecoder.decodeMethod(minionDeets.data);
        setDecodedData(_decodedData);
      } catch (err) {
        console.log(err);
      }
    };
    getAbi();
  }, [proposal, minionDeets]);

  const displayDecodedData = (data) => {
    return (
      <>
        <Text>Method: {data.name}</Text>
        <Divider />
        {data.params.map((param, idx) => {
          return (
            <Box key={idx}>
              <Text>
                Param {idx + 1}: {param.name}
              </Text>
              <Text>Type: {param.type}</Text>
              <Text>Value: {param.value.toString()}</Text>
              <Divider />
            </Box>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Skeleton isLoaded={!loading}>
        {minionDeets && (
          <Box w='100%' mt={8}>
            <Box mb={3}>
              Target Address: <AddressAvatar addr={minionDeets.to} />
            </Box>
            <Button onClick={() => openModal('minionDeets')}>More info</Button>
          </Box>
        )}
      </Skeleton>
      <Modal
        isOpen={modals.minionDeets}
        onClose={() => closeModals()}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          rounded='lg'
          bg='black'
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
              Minion Details
            </Box>
          </ModalHeader>
          <ModalCloseButton color='white' />
          <ModalBody
            flexDirection='column'
            display='flex'
            maxH='300px'
            overflowY='scroll'
          >
            {decodedData && displayDecodedData(decodedData)}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
