import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import abiDecoder from 'abi-decoder';
import { rgba } from 'polished';

import { MinionService } from '../services/minionService';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { chainByID } from '../utils/chain';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import UberHausAvatar from './uberHausAvatar';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const ProposalMinionCard = ({ proposal }) => {
  const { daochain } = useParams();
  const { theme } = useCustomTheme();
  const [minionDeets, setMinionDeets] = useState();
  const [decodedData, setDecodedData] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getMinionDeets = async () => {
      try {
        if (proposal.proposalType === PROPOSAL_TYPES.MINION_VANILLA) {
          const action = await MinionService({
            minion: proposal?.minionAddress,
            chainID: daochain,
          })('getAction')({ proposalId: proposal?.proposalId });
          setMinionDeets(action);
        } else if (
          proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE ||
          proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_RQ
        ) {
          const action = await UberHausMinionService({
            uberHausMinion: proposal.minionAddress,
            chainID: daochain,
          })('getAction')({ proposalId: proposal?.proposalId });
          setMinionDeets(action);
        } else if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
          const action = await UberHausMinionService({
            uberHausMinion: proposal.minionAddress,
            chainID: daochain,
          })('getAppointment')({ proposalId: proposal?.proposalId });

          setMinionDeets(action);
        }
      } catch (err) {
        console.error(err);
        setMinionDeets(null);
      } finally {
        setLoading(false);
      }
    };
    if (proposal?.proposalId && proposal?.minionAddress && daochain) {
      getMinionDeets();
    }
  }, [proposal, daochain]);

  useEffect(() => {
    const getAbi = async () => {
      try {
        const key =
          daochain === '0x64' ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
        const url = `${chainByID(daochain).abi_api_url}${minionDeets.to}${key &&
          `&apikey=${key}`}`;
        const response = await fetch(url);
        const json = await response.json();
        const parsed = JSON.parse(json.result);
        abiDecoder.addABI(parsed);
        const localDecodedData = abiDecoder.decodeMethod(minionDeets.data);
        setDecodedData(localDecodedData);
      } catch (err) {
        console.log(err);
      }
    };
    if (
      proposal &&
      minionDeets?.data &&
      proposal.proposalType !== PROPOSAL_TYPES.MINION_UBER_DEL
    ) {
      getAbi();
    }
  }, [proposal, minionDeets]);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const getAvatar = addr => {
    if (addr?.toLowerCase() === UBERHAUS_DATA.ADDRESS.toLowerCase()) {
      return <UberHausAvatar />;
    }
    return <AddressAvatar addr={minionDeets.to} alwaysShowName />;
  };

  const displayDecodedData = data => {
    return (
      <>
        <HStack spacing={3}>
          <TextBox size='xs'>Method</TextBox>
          <TextBox variant='value'>{data.name}</TextBox>
        </HStack>
        <Divider my={2} />
        <Box fontFamily='heading' mt={4}>
          Params
        </Box>
        {data.params.map((param, idx) => {
          return (
            <Box key={idx}>
              <HStack spacing={3}>
                <TextBox size='xs'>{`Param${idx + 1}:`}</TextBox>
                <TextBox variant='value'>{param.name}</TextBox>
              </HStack>
              <HStack spacing={3}>
                <TextBox size='xs'>Type:</TextBox>
                <TextBox variant='value'>{param.type}</TextBox>
              </HStack>
              <TextBox size='xs'>Value:</TextBox>
              <TextBox variant='value'>{param.value.toString()}</TextBox>
              <Divider my={2} />
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
          <Flex mt={6}>
            <Flex flexDir='column'>
              <TextBox size='xs' mb={3}>
                {minionDeets?.nominee ? 'Delegate Nominee' : 'Target Address'}
              </TextBox>
              {minionDeets?.to && getAvatar(minionDeets.to)}
              {minionDeets?.nominee && (
                <Box>
                  <AddressAvatar addr={minionDeets.nominee} alwaysShowName />
                </Box>
              )}

              {minionDeets?.to && (
                <Button
                  mt={3}
                  px={3}
                  py={1}
                  width='fit-content'
                  color='secondary.300'
                  onClick={toggleModal}
                  size='xs'
                  variant='outline'
                  textTransform='capitalize'
                >
                  Details
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </Skeleton>
      <Modal isOpen={showModal} onClose={toggleModal} isCentered>
        <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
