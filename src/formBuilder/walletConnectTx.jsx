import React, { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { RiQrCodeLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import Icon from '@chakra-ui/icon';
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';

import FieldWrapper from './fieldWrapper';
import GenericInput from './genericInput';
import { ReactComponent as WalletConnectLogo } from '../assets/img/wallet_connect.svg';
import useWalletConnect from '../hooks/useWalletConnect';
import { useAppModal } from '../hooks/useModals';

const WalletConnectTx = props => {
  const {
    localForm,
    localValues,
    name,
    setCustomSecondaryBtn,
    setCustomLifecycleFns,
  } = props;
  const { daochain } = useParams();
  const { closeModal } = useAppModal();
  const { safeAddress } = localValues;
  const {
    wcConnector,
    txPayload,
    wcClientData,
    wcConnect,
    wcDisconnect,
  } = useWalletConnect();

  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const { setValue } = localForm;

  useEffect(() => {
    if (wcConnector) {
      setCustomSecondaryBtn({
        text: 'Close',
        fn: async () => {
          await wcDisconnect(wcConnector);
          closeModal();
        },
      });
    }
  }, [wcConnector]);

  useEffect(() => {
    if (txPayload?.params?.length) {
      setValue(
        'TX',
        txPayload.params.map(tx => ({
          targetContract: tx.to,
          data: tx.data,
          minionValue: tx.value,
          operation: tx.operation || '0',
        })),
      );
      setCustomLifecycleFns({
        onTxError: error => {
          wcConnector.rejectRequest({
            id: txPayload.id,
            error: { message: error },
          });
        },
        onPollSuccess: txHash => {
          wcConnector.approveRequest({
            id: txPayload.id,
            result: txHash,
          });
        },
      });
    }
  }, [txPayload]);

  const clean = () => {
    setValue(name, '');
    setConnectionStatus('DISCONNECTED');
    setValue('TX', null);
  };

  const handleWCLink = async uri => {
    if (uri.startsWith('wc:')) {
      setConnectionStatus('CONNECTING');
      wcConnect({ chainId: daochain, safeAddress, uri });
    }
  };

  const disconnect = () => {
    wcDisconnect(wcConnector);
    clean();
  };

  return (
    <FieldWrapper {...props}>
      <Flex align='center' direction='column' mb={4}>
        <Box
          borderRadius='lg'
          w='100%'
          p={4}
          mb={4}
          border='1px'
          borderColor='#2F84FA'
          borderStyle='dashed'
          textAlign='center'
          minHeight={270}
        >
          <AspectRatio ratio={1} maxWidth={70} maxHeight={70} m='auto' mb={2}>
            {connectionStatus !== 'DISCONNECTED' && wcClientData?.icons?.[0] ? (
              <Image src={wcClientData.icons[0]} />
            ) : (
              <WalletConnectLogo />
            )}
          </AspectRatio>
          {connectionStatus === 'DISCONNECTED' && (
            <>
              <Box mb={5}>
                Connect your Safe to a dApp via the WalletConnect and trigger
                transactions
              </Box>
              <GenericInput
                {...props}
                label=''
                placeholder={props.label}
                prepend={<RiQrCodeLine />}
                onChange={e => handleWCLink(e.target.value)}
              />
            </>
          )}
          {connectionStatus === 'CONNECTING' && (
            <>
              {!wcClientData ? (
                <VStack>
                  <Spinner mb={5} />
                  <Button size='sm' onClick={disconnect}>
                    Cancel
                  </Button>
                </VStack>
              ) : (
                <Box>
                  <Text mb={5}>
                    {`Trying to connect to ${wcClientData?.name}`}
                  </Text>
                  <HStack justifyContent='center'>
                    <Button
                      size='sm'
                      onClick={() => setConnectionStatus('CONNECTED')}
                    >
                      Continue
                    </Button>
                    <Button size='sm' onClick={disconnect}>
                      Cancel
                    </Button>
                  </HStack>
                </Box>
              )}
            </>
          )}
          {connectionStatus === 'CONNECTED' && (
            <VStack>
              <Text>{wcClientData?.name}</Text>
              <Text>CONNECTED</Text>
              <Text fontSize='xs' mb={5}>
                You need to keep this WalletConnect modal open for transactions
                to pop up and be sent as a minion proposal.
              </Text>
              {!txPayload ? (
                <Box>
                  <Spinner mb={5} />
                  <Text fontSize='xs' mb={5}>
                    Waiting for a Tx to be triggered...
                  </Text>
                </Box>
              ) : (
                <Box>
                  <Icon
                    as={BsCheckCircle}
                    color='green'
                    w='25px'
                    h='25px'
                    mb={2}
                  />
                  <Text fontSize='xs' mb={5}>
                    Tx Ready to Submit!
                  </Text>
                </Box>
              )}
              <Button size='sm' onClick={disconnect}>
                Disconnect
              </Button>
            </VStack>
          )}
        </Box>
      </Flex>
    </FieldWrapper>
  );
};

export default WalletConnectTx;
