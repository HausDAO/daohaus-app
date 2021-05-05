import React from 'react';
import {
  Flex,
  Box,
  Skeleton,
  Image,
  useToast,
  Icon,
  Button,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { numberWithCommas } from '../utils/general';
import MinionNftTile from './minionNftTitle';
import { useOverlay } from '../contexts/OverlayContext';
import TextBox from './TextBox';
import GenericModal from '../modals/genericModal';

const MinionTokenListCard = ({ token, action }) => {
  console.log('token', token);
  const toast = useToast();
  const { setGenericModal } = useOverlay();
  const { handleSubmit, register, setValue } = useForm();

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSend = async () => {
    setGenericModal({ [token.contractAddress]: true });
  };

  const sendToken = async values => {
    action(values, token);
  };

  return (
    <>
      <Flex h='60px' align='center'>
        <Box w='15%' d={['none', null, null, 'inline-block']}>
          <Skeleton isLoaded={token?.symbol}>
            <Flex align='center'>
              {token?.logoUri && (
                <Image src={token.logoUri} height='35px' mr='15px' />
              )}

              <Box fontFamily='mono'>{token?.symbol}</Box>

              <CopyToClipboard
                text={token?.contractAddress}
                onCopy={copiedToast}
              >
                <Icon
                  as={FaCopy}
                  color='secondary.300'
                  ml={2}
                  _hover={{ cursor: 'pointer' }}
                />
              </CopyToClipboard>
            </Flex>
          </Skeleton>
        </Box>
        <Box w={['60%', null, null, '50%']}>
          <Skeleton isLoaded={token?.balance}>
            <Box fontFamily='mono'>
              {token.balance ? (
                <>
                  {`${numberWithCommas(
                    parseFloat(+token.balance / 10 ** +token.decimals).toFixed(
                      4,
                    ),
                  )} ${token.symbol}`}
                </>
              ) : null}
            </Box>
          </Skeleton>
        </Box>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          {token?.type !== 'ERC-721' && (
            <Skeleton isLoaded={token?.usd >= 0}>
              <Box fontFamily='mono'>
                {token?.usd ? (
                  <Box>{`$${numberWithCommas(token?.usd.toFixed(2))}`}</Box>
                ) : (
                  '--'
                )}
              </Box>
            </Skeleton>
          )}
        </Box>
        <Box w={['20%', null, null, '20%']}>
          {token?.type !== 'ERC-721' && (
            <Skeleton isLoaded={token?.totalUSD >= 0}>
              <Box fontFamily='mono'>
                {token?.balance ? (
                  <Box>
                    {`$${numberWithCommas(token?.totalUSD.toFixed(2))}`}
                  </Box>
                ) : (
                  '--'
                )}
              </Box>
            </Skeleton>
          )}
        </Box>
        <Box w={['20%', null, null, '20%']}>
          {token?.type !== 'ERC-721' && (
            <Box fontFamily='mono'>
              <Box>
                <Button size='xs' onClick={handleSend}>
                  SEND
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
      {token?.type === 'ERC-721' && (
        <Flex flexWrap='wrap'>
          {token?.tokenURIs &&
            token.tokenURIs.map((meta, idx) => (
              <MinionNftTile
                key={idx}
                tokenId={token.tokenIds[idx]}
                meta={meta}
              />
            ))}
        </Flex>
      )}
      <GenericModal closeOnOverlayClick modalId={`${token.contractAddress}`}>
        <form onSubmit={handleSubmit(sendToken)}>
          <TextBox as={FormLabel} size='xs' htmlFor='amount'>
            Amount{' '}
            <Button
              onClick={() =>
                setValue('amount', +token?.balance / 10 ** token.decimals)
              }
              size='xs'
            >
              Max{' '}
              {`$${numberWithCommas(+token?.balance / 10 ** token.decimals)}`}
            </Button>
          </TextBox>
          <Input
            name='amount'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'amount is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='destination'>
            Destination
          </TextBox>
          <Input
            name='destination'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'destination is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>
    </>
  );
};

export default MinionTokenListCard;
