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
  ModalFooter,
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

const ProposalMinionCard = ({ proposal }) => {
  const { daochain } = useParams();
  const { theme } = useCustomTheme();
  const [minionDeets, setMinionDeets] = useState();
  const [decodedData, setDecodedData] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let action;
    const getMinionDeets = async () => {
      try {
        action = await MinionService({
          minion: proposal?.minionAddress,
          chainID: daochain,
        })('getAction')({ proposalId: proposal?.proposalId });
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
  }, [proposal]);

  useEffect(() => {
    if (!minionDeets) {
      return;
    }
    const getAbi = async () => {
      try {
        const key = daochain === 100 ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
        const url = `${chainByID(daochain).abi_api_url}${minionDeets.to}${key &&
          '&apikey=' + key}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, minionDeets]);

  const displayDecodedData = (data) => {
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
                <TextBox size='xs'>Param {idx + 1}:</TextBox>
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
          <HStack mt={8} spacing={2}>
            <Box>
              <TextBox size='xs' mb={3}>
                Target Address
              </TextBox>
              <AddressAvatar addr={minionDeets.to} alwaysShowName={true} />
            </Box>
            <Flex w={['25%', null, null, '15%']} align='center' m={0}>
              <Button w='175px' onClick={() => setShowModal(true)}>
                More info
              </Button>
            </Flex>
          </HStack>
        )}
      </Skeleton>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
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

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
