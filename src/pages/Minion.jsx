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
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiArrowLeftLine } from 'react-icons/ri';
import { BigNumber } from 'ethers';
import { utils } from 'web3';
import { FaCopy } from 'react-icons/fa';
import makeBlockie from 'ethereum-blockies-base64';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { detailsToJSON, truncateAddr } from '../utils/general';

import MainViewLayout from '../components/mainViewLayout';

import MinionTokenList from '../components/minionTokenList';

import { supportedChains } from '../utils/chain';
import { balanceChainQuery } from '../utils/theGraph';
import HubBalanceList from '../components/hubBalanceList';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { MinionService } from '../services/minionService';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { TokenService } from '../services/tokenService';
import MinionNativeToken from '../components/minionNativeToken';
import { NiftyService } from '../services/niftyService';

const MinionDetails = ({
  overview,
  currentDaoTokens,
  minionType,
  isMember,
}) => {
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [minionData, setMinionData] = useState();
  const [daoBalances, setDaoBalances] = useState();
  const [balancesGraphData, setBalanceGraphData] = useState({
    chains: [],
    data: [],
  });
  const [loading, setLoading] = useState();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
    setGenericModal,
  } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const now = (new Date().getTime() / 1000).toFixed();
  const { refreshDao } = useTX();
  const { address, injectedProvider } = useInjectedProvider();

  const hasLoadedBalanceData =
    balancesGraphData.chains.length === Object.keys(supportedChains).length;

  useEffect(() => {
    console.log('overview', minionType, overview);
    if (!overview?.minions.length) {
      return;
    }
    const localMinionData = overview?.minions.find(m => {
      return m.minionAddress === minion;
    });

    setMinionData(localMinionData);
  }, [overview, minion]);

  useEffect(() => {
    console.log('get minion balance', minionData);
    if (minionData) {
      balanceChainQuery({
        reactSetter: setBalanceGraphData,
        address: minionData.minionAddress,
      });
    }
  }, [minionData]);

  useEffect(() => {
    if (hasLoadedBalanceData) {
      console.log('resorting balances');
      const tokenBalances = balancesGraphData.data
        .flatMap(bal => {
          return bal.tokenBalances.map(b => {
            return { ...b, moloch: bal.moloch, meta: bal.meta };
          });
        })
        .filter(bal => +bal.tokenBalance > 0);

      setDaoBalances(tokenBalances);
    }
  }, [hasLoadedBalanceData]);

  const refreshGraphBalances = () => {
    setBalanceGraphData({
      chains: [],
      data: [],
    });
    balanceChainQuery({
      reactSetter: setBalanceGraphData,
      address: minionData.minionAddress,
    });
  };

  const copiedToast = () => {
    toast({
      title: 'Copied Minion Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const submitMinion = async (args, serviceName = null) => {
    // TODO: this should be handled different probably
    // add extra args for special minion type
    console.log('minionType', minionType);
    if (minionType === 'niftyMinion') {
      console.log('push');
      // this should be the moloch deposit token
      args.push(overview.depositToken.tokenAddress, 0);
    }
    console.log('args', args);
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: minionData.minionAddress,
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
            refreshGraphBalances();
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion: minionData.minionAddress,
        chainID: daochain,
        minionType,
      })(serviceName || 'proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  const withdraw = async (token, transfer) => {
    setLoading(true);
    const args = [
      token.moloch.id,
      token.token.tokenAddress,
      token.tokenBalance,
      transfer,
    ];
    submitMinion(args, 'crossWithdraw');
  };

  const sendNativeToken = async values => {
    const details = detailsToJSON({
      title: `${minionData.details || 'Minion'} sends native token`,
      description: values.description || `Send ${values.amount} `,
      // link: (link to block explorer)
      type: 'nativeTokenSend',
    });
    const amountInWei = injectedProvider.utils.toWei(values.amount);
    const args = [values.destination, amountInWei, '0x0', details];
    submitMinion(args);
  };

  const sendErc20Action = async (values, token) => {
    setLoading(true);
    const tokenService = TokenService({
      tokenAddress: token.contractAddress,
      chainID: daochain,
    });
    const parsed = utils.toWei(values.amount);
    const amountWithDecimal = BigNumber.from(parsed).mul(
      BigNumber.from(10).pow(+token.decimals),
    );

    const hexData = tokenService('transferNoop')({
      to: values.destination,
      amount: utils.fromWei(amountWithDecimal.toString()).toString(),
    });

    const details = detailsToJSON({
      title: `${minionData.details || 'Minion'} sends a token`,
      description:
        values.description || `Send ${values.amount} ${token.symbol}`,
      // link: (link to block explorer)
      type: 'tokenSend',
    });
    const args = [token.contractAddress, '0', hexData, details];
    submitMinion(args);
  };

  const sendErc721Action = async (values, token, tokenId) => {
    setLoading(true);
    console.log(values);

    const niftyService = NiftyService({
      tokenAddress: token.contractAddress,
      chainID: daochain,
    });

    const hexData = await niftyService('safeTransferFromNoop')({
      tokenId,
      destination: values.destination,
      from: overview.minions[0].minionAddress,
    });
    // TODO: should this be nifty minion only?
    // const hexData = await niftyService('safeTransferFromNoop')({
    //   tokenId,
    //   destination: values.destination,
    //   from: overview?.minions.find(m => {
    //     return m.minionType === 'nifty minion';
    //   })?.minionAddress,
    // });

    const details = detailsToJSON({
      title: `${minionData.details || 'Minion'} Sends a Nifty`,
      description: `Send NFT to ${values.destination}`,
      // link: nftImage || null,
      type: 'niftyMinion',
    });
    const args = [token.contractAddress, '0', hexData, details];
    submitMinion(args);
  };

  // niftyink only
  const sellNiftyAction = async (values, token, tokenId) => {
    setLoading(true);

    console.log(values);

    const niftyService = NiftyService({
      tokenAddress: token.contractAddress,
      chainID: daochain,
    });

    const priceInWei = injectedProvider.utils.toWei(values.price);
    console.log('priceInWei', priceInWei);
    const hexData = await niftyService('setTokenPriceNoop')({
      tokenId,
      price: priceInWei,
    });

    const details = detailsToJSON({
      title: `${minionData.details || 'Minion'} Sells a Nifty`,
      description: 'Sell NFT',
      // link: nftImage || null,
      type: 'niftyMinion',
    });
    const args = [token.contractAddress, '0', hexData, details];
    submitMinion(args);
  };

  return (
    <MainViewLayout header={minionType || 'Minion'} isDao>
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
                    <Heading>
                      {minionType || null} {minionData.details}
                    </Heading>
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
              <Box>
                <TextBox size='md' align='center'>
                  Unclaimed balances in DAOs (for withdraw){' '}
                </TextBox>
                <HubBalanceList
                  tokens={daoBalances}
                  withdraw={withdraw}
                  loading={loading}
                  currentDaoTokens={currentDaoTokens}
                />
              </Box>
              <Box pt={6}>
                <Stack spacing={6}>
                  <Box>
                    <TextBox size='md' align='center'>
                      Minion wallet
                    </TextBox>
                    <MinionNativeToken
                      action={sendNativeToken}
                      isMember={isMember}
                    />
                    {daochain !== '0x64' && (
                      <Flex>View token data on etherscan</Flex>
                    )}

                    <MinionTokenList
                      minion={minionData.minionAddress}
                      sendErc20Action={sendErc20Action}
                      sendErc721Action={sendErc721Action}
                      sellNiftyAction={sellNiftyAction}
                      isMember={isMember}
                    />
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
    </MainViewLayout>
  );
};

export default MinionDetails;
