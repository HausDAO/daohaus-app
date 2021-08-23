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
import UberHausAvatar from './uberHausAvatar';
import TextBox from './TextBox';
import { chainByID } from '../utils/chain';
import { hasMinionActions, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const ProposalMinionCard = ({ proposal, minionAction }) => {
  const { daochain } = useParams();
  const { theme } = useCustomTheme();
  const [minionDeets, setMinionDeets] = useState();
  const [decodedData, setDecodedData] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (minionAction && proposal) {
      const formattedActions = {
        ...minionAction,
        actions:
          proposal.actions.length > 0
            ? proposal.actions.map(a => {
                return { to: a.target, ...a };
              })
            : [minionAction],
      };

      setMinionDeets(formattedActions);
    }
  }, [minionAction, proposal]);

  useEffect(() => {
    const hydrateActions = async () => {
      const promRes = await Promise.all(
        minionDeets.actions.map(async action => {
          const hydratedAction = { ...action };
          try {
            const key =
              daochain === '0x64' ? '' : process.env.REACT_APP_ETHERSCAN_KEY;
            const url = `${chainByID(daochain).abi_api_url}${action.proxyTo ||
              action.to}${key && `&apikey=${key}`}`;
            const response = await fetch(url);
            const json = await response.json();

            if (json.status === '0') {
              return hydratedAction;
            }
            const parsed = JSON.parse(json.result);
            const imp = parsed.find(p => p.name === 'implementation');
            if (imp) {
              const rpcUrl = chainByID(daochain).rpc_url;
              const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

              const abi = parsed;
              const contract = new web3.eth.Contract(abi, action.to);
              const newaddr = await contract.methods.implementation().call();
              hydratedAction.proxyTo = newaddr;
              return null;
            }
            abiDecoder.addABI(parsed);
            const localDecodedData = abiDecoder.decodeMethod(action.data);
            hydratedAction.decodedData = localDecodedData;
            return hydratedAction;
          } catch (err) {
            console.log(err);
            return hydratedAction;
          }
        }),
      );

      console.log('promRes', promRes);
      setDecodedData(promRes);
    };

    if (
      proposal &&
      minionDeets &&
      proposal.proposalType !== PROPOSAL_TYPES.MINION_UBER_DEL
    ) {
      hydrateActions();
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
    if (data.decodedData) {
      return (
        <>
          <HStack spacing={3}>
            <TextBox size='xs'>Method</TextBox>
            <TextBox variant='value'>{data.decodedData?.name}</TextBox>
          </HStack>
          <Divider my={2} />
          <Box fontFamily='heading' mt={4}>
            Params
          </Box>
          {data.decodedData?.params.map((param, idx) => {
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
    }
    return (
      <TextBox mt={2} size='sm'>
        Could not decode action data
      </TextBox>
    );
  };

  if (hasMinionActions(proposal, minionDeets)) {
    return null;
  }

  return (
    <>
      {minionDeets && (
        <Flex mt={6}>
          <Flex flexDir='column'>
            {minionDeets?.data && (
              <>
                <TextBox size='xs' mb={3}>
                  {minionDeets?.nominee ? 'Delegate Nominee' : 'Target Address'}
                </TextBox>
                {minionDeets?.to && getAvatar(minionDeets.to)}
                {minionDeets?.nominee && (
                  <Box>
                    <AddressAvatar addr={minionDeets.nominee} alwaysShowName />
                  </Box>
                )}
              </>
            )}

            {proposal.minion.minionType === 'Neapolitan minion' &&
              minionDeets?.actions.length > 0 && (
                <TextBox size='xs' mb={3}>
                  Multiple Action Proposal
                </TextBox>
              )}

            {minionDeets?.actions.length > 0 && (
              <>
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
              </>
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
              Minion Action Details
            </Box>
          </ModalHeader>
          <ModalCloseButton color='white' />

          <ModalBody
            flexDirection='column'
            display='flex'
            maxH='300px'
            overflowY='scroll'
          >
            {minionDeets?.actions.map((action, i) => {
              return (
                <Box key={`${action.to}_${i}`}>
                  <TextBox size='sm' fontWeight='900'>
                    Action {i + 1}
                  </TextBox>

                  {action.proxyTo ? (
                    <TextBox size='xs'>Target Proxy: {action.proxyTo}</TextBox>
                  ) : (
                    <TextBox size='xs'>Target: {action.to}</TextBox>
                  )}
                  <TextBox size='xs'>VALUE: {action.value}</TextBox>
                  {decodedData && displayDecodedData(decodedData[i])}
                  <Divider my={5} />
                </Box>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
