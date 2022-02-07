import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import abiDecoder from 'abi-decoder';
import { rgba } from 'polished';
import { v4 as uuid } from 'uuid';
import Web3, { utils as Web3Utils } from 'web3';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import UberHausAvatar from './uberHausAvatar';
import { chainByID } from '../utils/chain';
import { decodeAMBTx, decodeMultisendTx } from '../utils/abi';
import { decodeAction } from '../utils/minionUtils';
import {
  hasMinionActions,
  MINION_TYPES,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const ProposalMinionCard = ({ proposal, minionAction }) => {
  const { daochain } = useParams();
  const { injectedProvider } = useInjectedProvider();
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

  const decodeFromEtherscan = async action => {
    let key;
    if (daochain === '0x89') {
      key = process.env.REACT_APP_POLYGONSCAN_KEY;
    } else {
      key = process.env.REACT_APP_ETHERSCAN_KEY;
    }
    const url = `${chainByID(daochain).abi_api_url}${action.proxyTo ||
      action.to}${key && `&apikey=${key}`}`;
    const response = await fetch(url);
    return response.json();
  };

  const checkIfProxy = async (abi, to) => {
    try {
      const rpcUrl = chainByID(daochain).rpc_url;
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      const contract = new web3.eth.Contract(abi, to);
      const implAddress = await contract.methods.implementation().call();
      return implAddress;
    } catch (error) {
      console.log('Error getting Proxy implementation', error);
    }
  };

  const buildEthTransferAction = action => ({
    name: 'ETH Transfer',
    params: [
      {
        name: 'value',
        type: 'uint256',
        value: injectedProvider.utils.toBN(action.value).toString(),
      },
    ],
  });

  useEffect(() => {
    const hydrateActions = async () => {
      const promRes = await Promise.all(
        minionDeets.actions.map(async action => {
          const hydratedAction = { ...action };
          try {
            if (proposal.minion.minionType === MINION_TYPES.SAFE) {
              const multisendAddress = `${
                chainByID(daochain).safeMinion.safe_mutisend_addr
              }`;
              const decodedMultisend = decodeMultisendTx(
                multisendAddress,
                action.data,
              );
              hydratedAction.decodedMultisend = decodedMultisend;
              hydratedAction.decodedData = {
                name: 'multiSend',
                actions: await Promise.all(
                  decodedMultisend.map(async action => {
                    if (action.data.slice(2).length === 0) {
                      return buildEthTransferAction(action);
                    }
                    let json = await decodeFromEtherscan(action);
                    if (json.status === '0') {
                      return {
                        to: action.to,
                        value: Web3Utils.toBN(action.value).toString(),
                      };
                    }
                    let parsed = JSON.parse(json.result);
                    const imp = parsed.find(p => p.name === 'implementation');
                    if (imp) {
                      hydratedAction.proxyTo = await checkIfProxy(
                        parsed,
                        action.to,
                      );
                      json =
                        hydratedAction.proxyTo &&
                        (await decodeFromEtherscan(hydratedAction));
                      if (!json || json.status === '0') {
                        return {
                          to: action.to,
                          value: Web3Utils.toBN(action.value).toString(),
                        };
                      }
                      parsed = JSON.parse(json.result);
                    }
                    abiDecoder.addABI(parsed);
                    return {
                      ...abiDecoder.decodeMethod(action.data),
                      to: action.to,
                      value: Web3Utils.toBN(action.value).toString(),
                    };
                  }),
                ),
              };
              if (
                hydratedAction.decodedData.actions[0]?.name ===
                'requireToPassMessage'
              ) {
                // cross-chain AMB bridge call
                const [
                  contract,
                  data,
                ] = hydratedAction.decodedData.actions[0].params;
                const ambDecodedTx = decodeAMBTx(contract.value, data.value);
                hydratedAction.decodedData.actions[0].actions = [
                  ...(await Promise.all(
                    decodeMultisendTx(ambDecodedTx.to, ambDecodedTx.data).map(
                      async action => ({
                        ...action,
                        data: await decodeAction(action, {
                          chainID: proposal.minion.foreignChainId,
                        }),
                      }),
                    ),
                  )),
                ];
              }
              return hydratedAction;
            }
            if (action.data.slice(2).length === 0) {
              return buildEthTransferAction(action);
            }
            let json = await decodeFromEtherscan(action);
            if (json.status === '0') {
              return hydratedAction;
            }
            let parsed = JSON.parse(json.result);
            const imp = parsed.find(p => p.name === 'implementation');
            if (imp) {
              hydratedAction.proxyTo = await checkIfProxy(parsed, action.to);
              json =
                hydratedAction.proxyTo &&
                (await decodeFromEtherscan(hydratedAction));
              if (!json || json.status === '0') {
                return hydratedAction;
              }
              parsed = JSON.parse(json.result);
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

  const displayActionData = (action, idx) => (
    <Box key={uuid()}>
      <HStack spacing={3}>
        <TextBox size='xs'>{`- Param${idx + 1}:`}</TextBox>
        <TextBox variant='value'>{action.name}</TextBox>
      </HStack>
      <HStack spacing={3} pl={3}>
        <TextBox size='xs'>Type:</TextBox>
        <TextBox variant='value'>{action.type}</TextBox>
      </HStack>
      <HStack spacing={3} pl={3}>
        <TextBox size='xs'>Value:</TextBox>
        <TextBox variant='value'>{action.value.toString()}</TextBox>
      </HStack>
      <Divider my={2} />
    </Box>
  );

  const displayDecodedData = data => {
    if (data.decodedData) {
      return (
        <Box key={uuid()}>
          <HStack spacing={3}>
            <TextBox size='xs'>Method</TextBox>
            <TextBox variant='value'>{data.decodedData?.name}</TextBox>
          </HStack>
          <Divider my={2} />
          <Box fontFamily='heading' mt={4}>
            {data.decodedData?.params && 'Params'}
            {data.decodedData?.actions && 'Actions'}
          </Box>
          <Divider my={2} />
          {data.decodedData?.params?.map(displayActionData)}
          {data.decodedData?.actions?.map((action, idx) => {
            return (
              <Box key={uuid()}>
                <HStack spacing={3}>
                  <TextBox size='xs' variant='mono'>
                    {`Action ${idx + 1}: ${action?.name || ''}`}
                  </TextBox>
                </HStack>
                {action?.to && (
                  <TextBox size='sm' variant='value' mb={2}>
                    {`To: ${action.to}`}
                  </TextBox>
                )}
                {action?.value && (
                  <TextBox size='xs'>{`Value: ${action.value}`}</TextBox>
                )}
                {action?.actions ? (
                  <>
                    <TextBox mt={2} size='xs' variant='mono'>
                      {`Subactions: ${action?.actions?.length}`}
                    </TextBox>
                    <Box ml={3}>
                      {action?.actions.map(a =>
                        displayDecodedData({
                          decodedData: {
                            name: a.data.name,
                            params: a.data.params,
                          },
                        }),
                      )}
                    </Box>
                  </>
                ) : action?.params ? (
                  <Box>{action.params.map(displayActionData)}</Box>
                ) : (
                  <Box>
                    <TextBox mt={2} size='sm' key={`decerror_${idx}`}>
                      Could not decode action data
                    </TextBox>
                    <Divider my={2} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
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
      <Modal isOpen={showModal} onClose={toggleModal} isCentered size='xl'>
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
                <Box key={uuid()}>
                  {proposal.minion.minionType !== MINION_TYPES.SAFE && (
                    <TextBox size='sm' fontWeight='900'>
                      Action {i + 1}
                    </TextBox>
                  )}
                  {action.proxyTo ? (
                    <TextBox size='xs'>
                      Target Proxy:{' '}
                      <TextBox size='xs' variant='value'>
                        {action.proxyTo}
                      </TextBox>
                    </TextBox>
                  ) : (
                    <TextBox size='xs'>
                      Target:{' '}
                      <TextBox size='xs' variant='value'>
                        {action.to}
                      </TextBox>
                    </TextBox>
                  )}
                  <TextBox size='xs'>VALUE: {action.value || '0'}</TextBox>
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
