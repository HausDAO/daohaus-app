import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  Icon,
  useToast,
  Avatar,
  Link,
  HStack,
  Stack,
  Button,
  FormLabel,
  Input,
  Image,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiArrowLeftLine } from 'react-icons/ri';

import { FaCopy } from 'react-icons/fa';
import makeBlockie from 'ethereum-blockies-base64';
import { useForm } from 'react-hook-form';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { detailsToJSON, truncateAddr } from '../utils/general';
import { useOverlay } from '../contexts/OverlayContext';

import MainViewLayout from '../components/mainViewLayout';
// import { initTokenData } from '../utils/tokenValue';

import MinionTokenList from '../components/minionTokenList';

import { NiftyService } from '../services/niftyService';
import { MinionService } from '../services/minionService';

import {
  fetchNativeBalance,
  getBlockScoutTokenData,
  getEtherscanTokenData,
} from '../utils/tokenExplorerApi';
import GenericModal from '../modals/genericModal';
import { getNftMeta } from '../utils/metadata';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const NiftInk = ({ overview }) => {
  const { daochain, daoid } = useParams();
  const minion = overview?.minions[0].minionAddress;
  const toast = useToast();
  const [minionData, setMinionData] = useState();
  const [contractBalances, setContractBalances] = useState();
  const [nativeBalance, setNativeBalance] = useState();
  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const [nftLoading, setNftLoading] = useState();
  const [currentError, setCurrentError] = useState();
  const [nftMeta, setNftMeta] = useState();
  const [nftPrice, setNftPrice] = useState();
  const { handleSubmit, errors, register } = useForm();
  const { cachePoll, resolvePoll } = useUser();
  const { refreshDao } = useTX();
  const { address, injectedProvider } = useInjectedProvider();

  const now = (new Date().getTime() / 1000).toFixed();

  console.log('minion', overview);

  useEffect(() => {
    const getContractBalance = async () => {
      try {
        setMinionData(overview?.minions[0]);

        if (daochain === '0x1' || daochain === '0x4' || daochain === '0x2a') {
          // eth chains not supported yet
          // may need to do something different for matic too
          setContractBalances(await getEtherscanTokenData(minion, daochain));
        } else {
          setContractBalances(await getBlockScoutTokenData(minion));
          const native = await fetchNativeBalance(minion);
          setNativeBalance(native.result / 10 ** 18);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContractBalance();
  }, [minion]);

  const copiedToast = () => {
    toast({
      title: 'Copied Minion Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleBlur = async e => {
    let ipfsHash;
    const { value } = e.target;

    setNftLoading(true);
    try {
      const niftyService = NiftyService({
        tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
        chainID: daochain,
      });
      console.log('niftyService', niftyService);
      console.log('value???', value);
      if (value.match(/Qm[a-zA-Z0-9]+/)) {
        [ipfsHash] = value.match(/Qm[a-zA-Z0-9]+/);
        console.log('ipfsHash', ipfsHash);
      } else {
        throw Error();
      }

      const tid = await niftyService('inkTokenByIndex')({
        inkUrl: ipfsHash,
        index: 0,
      });
      console.log(tid);
      const uri = await niftyService('tokenURI')({
        tokenId: tid,
      });
      const price = await niftyService('tokenPrice')({
        tokenId: tid,
      });
      setNftPrice(price);
      // https://thegraph.com/explorer/subgraph/azf20/nifty-ink
      // https://api.thegraph.com/subgraphs/name/azf20/nifty-ink
      //
      // query ink($inkUrl: String!, $liker: String) {
      //   metaData(id: "blockNumber") {
      //     id
      //     value
      //     __typename
      //   }
      //   ink(id: $inkUrl) {
      //     id
      //     inkNumber
      //     jsonUrl
      //     artist {
      //       id
      //       __typename
      //     }
      //     limit
      //     count
      //     createdAt
      //     mintPrice
      //     mintPriceNonce
      //     likeCount
      //     likes(where: {liker: $liker}) {
      //       id
      //       __typename
      //     }
      //     tokens(first: 500) {
      //       id
      //       owner
      //       network
      //       price
      //       __typename
      //     }
      //     __typename
      //   }
      // }

      // inks(where: {id:"QmRpaKKgS44t57BRkR7oQqppzb816tSgD5K7oc4FtN3mdo"}) {
      //     mintPrice
      //   }
      const url = `https://gateway.pinata.cloud/ipfs/${uri.match(
        /Qm[a-zA-Z0-9]+/,
      )}`;
      console.log('url', url);
      const response = await getNftMeta(url);
      console.log('response', response);
      setNftMeta(response);

      setNftLoading(false);
    } catch (err) {
      setNftLoading(false);
      setCurrentError(err);
      console.log(err);
    }
  };

  const sendToken = async values => {
    setNftLoading(true);
    console.log(values);

    const niftyService = NiftyService({
      tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      chainID: daochain,
    });

    const hexData = await niftyService('safeTransferFromNoop')({
      tokenId: values.tokenId,
      destination: values.destination,
      from: overview.minions[0].minionAddress,
    });

    const details = detailsToJSON({
      title: `${minionData.details} Sends a Nifty`,
      description: `Send NFT to ${values.destination}`,
      // link: nftImage || null,
      type: 'niftyInk',
    });
    const args = [
      '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      '0',
      hexData,
      details,
    ];
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: overview.minions[0],
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setNftLoading(false);
      console.log('error: ', err);
    }
  };

  const sellToken = async values => {
    setNftLoading(true);
    console.log(values);

    const niftyService = NiftyService({
      tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      chainID: daochain,
    });

    const priceInWei = injectedProvider.utils.toWei(values.price);
    console.log('priceInWeipriceInWeipriceInWeipriceInWei', priceInWei);
    const hexData = await niftyService('setTokenPriceNoop')({
      tokenId: values.tokenId,
      price: priceInWei,
    });

    const details = detailsToJSON({
      title: `${minionData.details} Sells a Nifty`,
      description: 'Sell NFT',
      // link: nftImage || null,
      type: 'niftyInk',
    });
    const args = [
      '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      '0',
      hexData,
      details,
    ];
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: overview.minions[0],
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setNftLoading(false);
      console.log('error: ', err);
    }
  };

  const onSubmit = async values => {
    setNftLoading(true);
    console.log('values', values.targetInk.match(/Qm[a-zA-Z0-9]+/));

    const niftyService = NiftyService({
      tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      chainID: daochain,
    });

    const hexData = await niftyService('buyInkNoop')({
      inkUrl: values.targetInk.match(/Qm[a-zA-Z0-9]+/)[0],
    });
    // TODO: add title and link (image)
    // add type
    // nftMeta
    console.log('nftMeta');
    const nftImage = nftMeta?.image && nftMeta?.image.replace('https://', '');

    const details = detailsToJSON({
      title: `${minionData.details} buys a Nifty`,
      description: `${nftMeta?.name} - ${nftMeta?.description}`,
      link: nftImage || null,
      type: 'niftyInk',
    });
    const args = [
      '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      injectedProvider.utils.toWei(values.price),
      hexData,
      details,
    ];
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: overview.minions[0],
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
            // createForumTopic({
            //   chainID: daochain,
            //   daoID: daoid,
            //   afterTime: now,
            //   proposalType: 'Minion Proposal',
            //   values,
            //   applicant: address,
            //   daoMetaData,
            // });
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setNftLoading(false);
      console.log('error: ', err);
    }
  };

  const action = {
    sell: () => setGenericModal({ niftySell: true }),
    send: () => setGenericModal({ niftySend: true }),
  };

  return (
    <MainViewLayout header='Minion' isDao>
      <Box>
        <Link as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
          <HStack spacing={3}>
            <Icon
              name='arrow-back'
              color='primary.50'
              as={RiArrowLeftLine}
              h='20px'
              w='20px'
            />
          </HStack>
        </Link>
        <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
          {minionData ? (
            <>
              <Flex
                p={4}
                justify='space-between'
                align='center'
                key={minionData.minionAddress}
              >
                <Box>
                  <Flex align='center'>
                    <Avatar
                      name={minionData.minionAddress}
                      src={makeBlockie(minionData.minionAddress)}
                      mr={3}
                    />
                    <Heading>{`${minionData.details} NiftInk Boost`}</Heading>
                  </Flex>
                </Box>
                <Flex align='center'>
                  <TextBox size='md' color='whiteAlpha.900'>
                    {`${minionData.minionType}: `}
                    <Box as='span' color='primary.100'>
                      {truncateAddr(minionData.minionAddress)}
                    </Box>
                  </TextBox>
                  <CopyToClipboard
                    text={minionData.minionAddress}
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
              </Flex>
              <Box pt={6}>
                <Stack spacing={6}>
                  <Box>
                    <TextBox size='md' align='center'>
                      Minion wallet
                    </TextBox>
                    <TextBox size='md' align='center'>
                      balance: {nativeBalance}
                    </TextBox>
                    {daochain !== '0x64' && (
                      <Flex>View token data on etherscan</Flex>
                    )}
                    {contractBalances && (
                      <MinionTokenList
                        tokens={contractBalances}
                        boost='NiftyInk'
                        action={action}
                      />
                    )}
                  </Box>
                  <Box>
                    <Button
                      onClick={() =>
                        setGenericModal({ [minionData.minionAddress]: true })
                      }
                    >
                      Buy Ink
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </>
          ) : (
            <Flex justify='center'>
              <Box fontFamily='heading'>No minion found</Box>
            </Flex>
          )}
        </ContentBox>
      </Box>
      <GenericModal closeOnOverlayClick modalId='niftySend'>
        <form onSubmit={handleSubmit(sendToken)}>
          {nftMeta && <Image src={nftMeta?.image} />}
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
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>
      <GenericModal closeOnOverlayClick modalId='niftySell'>
        <form onSubmit={handleSubmit(sellToken)}>
          {nftMeta && <Image src={nftMeta?.image} />}
          <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
            Price
          </TextBox>
          <Input
            name='price'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Price is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <Button type='submit'>Propose Sell</Button>
        </form>
      </GenericModal>
      {minionData && (
        <GenericModal closeOnOverlayClick modalId={minionData.minionAddress}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {nftMeta && <Image src={nftMeta?.image} />}
            <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
              Target Ink URL
            </TextBox>
            <Input
              name='targetInk'
              placeholder='https://...'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Target ink is required',
                },
              })}
              focusBorderColor='secondary.500'
              onBlur={handleBlur}
            />
            <TextBox as={FormLabel} size='xs' htmlFor='price'>
              price
            </TextBox>
            <Input
              name='price'
              placeholder='4.9'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'price is required',
                },
              })}
              focusBorderColor='secondary.500'
            />
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={nftLoading}
              disabled={!nftMeta}
            >
              Propose Buy
            </Button>
          </form>
        </GenericModal>
      )}
    </MainViewLayout>
  );
};

export default NiftInk;
