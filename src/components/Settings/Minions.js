import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Heading,
  Icon,
  useToast,
  Button,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  useDao,
  useModals,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { truncateAddr } from '../../utils/helpers';
import { FaCopy } from 'react-icons/fa';
import { useEffect } from 'react/cjs/react.development';
import { TokenService } from '../../utils/token-service';
import ProposalFormModal from '../Modal/ProposalFormModal';

const Minions = () => {
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const { modals, openModal } = useModals();
  const toast = useToast();
  const { minion } = useParams();
  const [minionData, setMinionData] = useState();
  const [tokenBalances, setTokenBalances] = useState();

  useEffect(() => {
    if (!dao.graphData?.minions.length) {
      return;
    }
    const _minionData = dao.graphData.minions.find((m) => {
      return m.minionAddress === minion;
    });
    setMinionData(_minionData);
  }, [dao.graphData, minion]);

  useEffect(() => {
    if (!dao.graphData) {
      return;
    }
    const getMinionBalances = async () => {
      const _tokenBalances = {};
      const promises = [];
      const tokens = dao.graphData.tokenBalances.map((b) => {
        const tokenService = new TokenService(
          web3Connect.web3,
          b.token.tokenAddress,
        );

        promises.push(tokenService.balanceOf(minion));
        return b.token.tokenAddress;
      });
      const balances = await Promise.all(promises);

      tokens.forEach((token, idx) => {
        _tokenBalances[tokens[idx]] =
          balances[idx] / 10 ** dao.graphData.tokenBalances[idx].token.decimals;
      });
      setTokenBalances(_tokenBalances);
    };

    getMinionBalances();
    // setMinionData(_minionData);
    // console.log('MINIONDATA', _minionData);
  }, [dao, web3Connect, minion]);
  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      {minionData && (
        <>
          <Flex
            p={4}
            justify='space-between'
            align='center'
            key={minionData.minionAddress}
          >
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              {minionData.minionType}: {minionData.details}{' '}
              {truncateAddr(minionData.minionAddress)}
              <CopyToClipboard
                text={minionData.minionAddress}
                onCopy={() =>
                  toast({
                    title: 'Copied Minion Address',
                    position: 'top-right',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }
              >
                <Icon as={FaCopy} color='secondary.300' ml={2} />
              </CopyToClipboard>
            </TextBox>
          </Flex>
          <Box>
            <Heading as='h4'>Get Balances</Heading>
            {tokenBalances &&
              Object.keys(tokenBalances).map((token) => {
                return (
                  <Text key={token}>
                    {token}: {tokenBalances[token]}
                  </Text>
                );
              })}
            <Heading as='h4'>Deposit/withdraw/dao withdraw</Heading>
            <Button onClick={() => openModal('minionDeets')}>
              Depost from DAO proposal
            </Button>
            <Button>Withdraw funds to DAO</Button>
            <Button>Withdraw funds another DAO</Button>
            <Heading as='h4'>New Prop/ Forged Prop</Heading>
            <Button onClick={() => openModal('minionDeets')}>
              New Minion proposal
            </Button>
            <Button>Forged Tool airdrop funds to member/s</Button>
            <Button>Forged Tool stream funds to member/s</Button>
            <Button>Forged Tool mint NFT</Button>
            <Heading as='h4'>Proposals</Heading>
          </Box>
        </>
      )}
      <ProposalFormModal isOpen={modals.minionDeets} proposalType={'minion'} />
    </ContentBox>
  );
};

export default Minions;
