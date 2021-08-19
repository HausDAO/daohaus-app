import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

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
  HStack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import abiDecoder from 'abi-decoder';
import { rgba } from 'polished';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { chainByID } from '../utils/chain';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import UberHausAvatar from './uberHausAvatar';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const ProposalMinionCard = ({ proposal, minionAction }) => {
  const { daochain } = useParams();
  const { theme } = useCustomTheme();
  const [minionDeets, setMinionDeets] = useState();
  const [decodedData, setDecodedData] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (minionAction) {
      setMinionDeets(minionAction);
    }
  }, [minionAction]);

  // console.log('minionDeets', minionDeets);
  // TODO: adjust this to use the action on the proposal object if neapolitan
  // - add to query Actions
  // needs to deal with multiple actions
  // console.log('proposal', proposal);

  // console.log('minionDeets', minionDeets);

  useEffect(() => {
    const getAbi = async () => {
      try {
        const key =
          daochain === '0x64' ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
        const url = `${chainByID(daochain).abi_api_url}${minionDeets.proxyTo ||
          minionDeets.to}${key && `&apikey=${key}`}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.status === '0') {
          // contract is not verified
          return;
        }
        const parsed = JSON.parse(json.result);
        const imp = parsed.find(p => p.name === 'implementation');
        if (imp) {
          const rpcUrl = chainByID(daochain).rpc_url;
          const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

          const abi = parsed;
          const contract = new web3.eth.Contract(abi, minionDeets.to);
          const newaddr = await contract.methods.implementation().call();
          console.log(newaddr);
          setMinionDeets({ ...minionDeets, proxyTo: newaddr });
          return null;
        }
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

  // hides details on funding and payroll proposals
  if (
    minionDeets &&
    minionDeets[1] === '0x0000000000000000000000000000000000000000'
  ) {
    return null;
  }

  return (
    <>
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

            {minionDeets.proposer && (
              <Box fontFamily='heading' textTransform='capitalize' size='xs'>
                ** Multicall detail coming soon
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
            {minionDeets?.proxyTo && (
              <TextBox size='xs'>Proxy: {minionDeets?.proxyTo}</TextBox>
            )}
            <TextBox size='xs'>VALUE: {minionDeets?.value}</TextBox>
            {decodedData && displayDecodedData(decodedData)}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
