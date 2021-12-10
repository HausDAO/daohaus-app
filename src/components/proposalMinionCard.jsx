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
import Web3, { utils as Web3Utils } from 'web3';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import UberHausAvatar from './uberHausAvatar';
import { chainByID } from '../utils/chain';
import { decodeMultisendTx, isProxyABI } from '../utils/abi';
import {
  hasMinionActions,
  MINION_TYPES,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import {
  buildEthTransferAction,
  decodeFromEtherscan,
  getProxiedAddress,
  isEthTransfer,
} from '../utils/minionUtils';
import useMinionAction from '../hooks/useMinionAction';

const ProposalMinionCard = ({ proposal, minionAction }) => {
  const { daochain } = useParams();
  const minionDeets = {};
  const decodedData = {};
  const { theme } = useCustomTheme();

  // const [minionDeets, setMinionDeets] = useState();
  // const [decodedData, setDecodedData] = useState();
  const actionData = useMinionAction(proposal);
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   if (minionAction && proposal) {
  //     const formattedActions = {
  //       ...minionAction,
  //       actions:
  //         proposal.actions.length > 0
  //           ? proposal.actions.map(a => {
  //               return { to: a.target, ...a };
  //             })
  //           : [minionAction],
  //     };
  //     setMinionDeets(formattedActions);
  //   }
  // }, [minionAction, proposal]);

  // useEffect(() => {
  //   const handleSafeActions = async action => {
  //     const multisendAddress = `${
  //       chainByID(daochain).safeMinion.safe_mutisend_addr
  //     }`;
  //     const decodedMultisend = decodeMultisendTx(multisendAddress, action.data);
  //     action.decodedMultisend = decodedMultisend;
  //     action.decodedData = {
  //       name: 'multiSend',
  //       actions: await Promise.all(
  //         decodedMultisend.map(async action => {
  //           if (isEthTransfer(action)) {
  //             return buildEthTransferAction(action);
  //           }
  //           let json = await decodeFromEtherscan(action);
  //           //  could not decode
  //           if (json.status === '0') {
  //             return {
  //               to: action.to,
  //               value: Web3Utils.toBN(action.value).toString(),
  //             };
  //           }
  //           let parsed = JSON.parse(json.result);
  //           const imp = parsed.find(p => p.name === 'implementation');
  //           if (imp) {
  //             action.proxyTo = await getProxiedAddress(
  //               parsed,
  //               action.to,
  //               daochain,
  //             );
  //             json = action.proxyTo && (await decodeFromEtherscan(action));
  //             if (!json || json.status === '0') {
  //               return {
  //                 to: action.to,
  //                 value: Web3Utils.toBN(action.value).toString(),
  //               };
  //             }
  //             parsed = JSON.parse(json.result);
  //           }
  //           abiDecoder.addABI(parsed);
  //           return {
  //             ...abiDecoder.decodeMethod(action.data),
  //             to: action.to,
  //             value: Web3Utils.toBN(action.value).toString(),
  //           };
  //         }),
  //       ),
  //     };
  //   };
  //   const hydrateActions = async () => {
  //     const promRes = await Promise.all(
  //       // only safe has more than 1 action
  //       minionDeets.actions.map(async action => {
  //         const hydratedAction = { ...action };
  //         try {
  //           if (proposal.minion.minionType === MINION_TYPES.SAFE) {
  //             return handleSafeActions(hydratedAction);
  //           }
  //           if (isEthTransfer(action)) {
  //             return buildEthTransferAction(action);
  //           }
  //           let json = await decodeFromEtherscan(action);
  //           if (json.status === '0') {
  //             // what does status === 0 mean?
  //             // in this part, we return whole hydrated action,
  //             // in Gnosis part we return the fields to and value
  //             // can they be the same thing?
  //             return hydratedAction;
  //           }

  //           const parsedAction = JSON.parse(action);
  //           if (isProxyABI(parsedAction)) {
  //             hydratedAction.proxyTo = await getProxiedAddress(
  //               parsedAction,
  //               parsedAction.to,
  //               daochain,
  //             );
  //             json =
  //               hydratedAction.proxyTo &&
  //               (await decodeFromEtherscan(hydratedAction));
  //             if (!json || json.status === '0') {
  //               return hydratedAction;
  //             }
  //             parsed = JSON.parse(json.result);
  //           }
  //           abiDecoder.addABI(parsed);
  //           const localDecodedData = abiDecoder.decodeMethod(action.data);
  //           hydratedAction.decodedData = localDecodedData;
  //           return hydratedAction;
  //         } catch (err) {
  //           console.log(err);
  //           return hydratedAction;
  //         }
  //       }),
  //     );

  //     setDecodedData(promRes);
  //   };

  //   if (
  //     proposal &&
  //     minionDeets &&
  //     proposal.proposalType !== PROPOSAL_TYPES.MINION_UBER_DEL
  //   ) {
  //     hydrateActions();
  //   }
  // }, [proposal, minionDeets]);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const getAvatar = addr => {
    if (addr?.toLowerCase() === UBERHAUS_DATA.ADDRESS.toLowerCase()) {
      return <UberHausAvatar />;
    }
    return <AddressAvatar addr={addr} alwaysShowName />;
  };

  const displayActionData = (action, idx) => (
    <Box key={idx}>
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
    if (data?.decodedData) {
      return (
        <>
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
              <Box key={`subaction_${idx}`}>
                <HStack spacing={3}>
                  <TextBox size='xs'>
                    {`Action ${idx + 1}: ${action?.name || ''}`}
                  </TextBox>
                </HStack>
                {action?.to && (
                  <TextBox size='xs'>{`To: ${action.to}`}</TextBox>
                )}
                {action?.value && (
                  <TextBox size='xs'>{`Value: ${action.value}`}</TextBox>
                )}
                {action?.params ? (
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
            {actionData?.data && (
              <>
                <TextBox size='xs' mb={3}>
                  {actionData?.nominee ? 'Delegate Nominee' : 'Target Address'}
                </TextBox>
                {actionData?.to && getAvatar(actionData.to)}
                {actionData?.nominee && (
                  <Box>
                    <AddressAvatar addr={minionDeets.nominee} alwaysShowName />
                  </Box>
                )}
              </>
            )}

            {minionDeets?.actions?.length > 0 && (
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
            {/* {minionDeets?.actions.map((action, i) => {
              return (
                <Box key={`${action.to}_${i}`}>
                  {proposal.minion.minionType !== MINION_TYPES.SAFE && (
                    <TextBox size='sm' fontWeight='900'>
                      Action {i + 1}
                    </TextBox>
                  )}
                  {action.proxyTo ? (
                    <TextBox size='xs'>Target Proxy: {action.proxyTo}</TextBox>
                  ) : (
                    <TextBox size='xs'>Target: {action.to}</TextBox>
                  )}
                  <TextBox size='xs'>VALUE: {action.value || '0'}</TextBox>
                  {decodedData && displayDecodedData(decodedData[i])}
                  <Divider my={5} />
                </Box>
              );
            })} */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalMinionCard;
