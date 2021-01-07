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
  ButtonGroup,
  Avatar,
  List,
  ListItem,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  useDao,
  useMembers,
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
import GenericModal from '../Modal/GenericModal';
import makeBlockie from 'ethereum-blockies-base64';

const Minions = () => {
  const [dao] = useDao();
  const [members] = useMembers();
  const [web3Connect] = useWeb3Connect();
  const { modals, openModal } = useModals();
  const toast = useToast();
  const { minion } = useParams();
  const [minionData, setMinionData] = useState();
  const [tokenBalances, setTokenBalances] = useState();
  const [proposalType, setProposalType] = useState();
  const [proposalPresets, setProposalPresets] = useState();
  const [withdrawSetup, setWithdrawSetup] = useState();

  const formPresets = () => {
    return {
      deposit: {
        heading: `New Deposit to Minion`,
        subline: `A proposal to deposit funds into a minion`,
        title: `Deposit funds to Minion (${minionData?.details})`,
        applicant: minionData?.minionAddress,
      },
      minion: {
        minionContract: minionData?.minionAddress,
      },
    };
  };

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
    if (!dao.graphData || !web3Connect.web3) {
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
  }, [dao, web3Connect, minion]);

  const handleDeposit = () => {
    setProposalType('funding');
    setProposalPresets(formPresets().deposit);
    openModal('proposal');
  };

  const handleNewMinion = () => {
    console.log('open minion');
    setProposalType('minion');
    setProposalPresets(formPresets().minion);
    openModal('minion');
  };

  const handleMinionWithdraw = () => {
    const minionMember = members.find(
      (member) => member.memberAddress === minion.minionAddress,
    );
    console.log(minionMember);
    setWithdrawSetup(minionMember);
    openModal('minionWithdraw');
  };

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
            <Box>
              <Avatar
                name={minionData.minionAddress}
                src={makeBlockie(minionData.minionAddress)}
                mr={3}
              />
              <TextBox size='md' colorScheme='whiteAlpha.900'>
                {minionData.details}
              </TextBox>
            </Box>
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              {minionData.minionType}: {truncateAddr(minionData.minionAddress)}
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
            <Button>Add Token</Button>

            <Heading as='h4'>Minion Internal Balance</Heading>
            <TextBox>Parent: 0 weth</TextBox>
            <Button>Add Dao</Button>
            <Heading as='h4'>Deposit/withdraw/dao withdraw</Heading>
            <Button onClick={handleDeposit}>Depost from DAO proposal</Button>
            <Button onClick={handleDeposit}>Transfer Minion Funds</Button>
            <Button onClick={handleMinionWithdraw}>
              Withdraw funds from DAO to Minion
            </Button>
            <Button onClick={handleMinionWithdraw}>
              Withdraw funds from another DAO to DAO
            </Button>
            <Heading as='h4'>New Prop/ Forged Prop</Heading>
            <Button onClick={handleNewMinion}>New Minion proposal</Button>
            <Button onClick={handleNewMinion}>Proposal on another DAO</Button>
            <Button>Forged Tool airdrop funds to member/s</Button>
            <Button>Forged Tool stream funds to member/s</Button>
            <Button>Forged Tool mint NFT</Button>
            <Heading as='h4'>Activity</Heading>
            <List>
              <ListItem>Proposal 1</ListItem>
              <ListItem>Proposal 2</ListItem>
              <ListItem>Proposal 3</ListItem>
            </List>
          </Box>
        </>
      )}
      <ProposalFormModal
        presets={proposalPresets}
        isOpen={modals.proposal}
        proposalType={proposalType}
      />
      <ProposalFormModal
        presets={proposalPresets}
        isOpen={modals.minion}
        proposalType={proposalType}
      />
      <GenericModal isOpen={modals.minionWithdraw}>
        <Flex align='center' direction='column'>
          <TextBox>Withdraw</TextBox>
          <TextBox>{withdrawSetup?.tokenBalances[0]}</TextBox>
          <ButtonGroup>
            <Button variant='outline'>Cancel</Button>
            <Button>Confirm</Button>
          </ButtonGroup>
        </Flex>
      </GenericModal>
    </ContentBox>
  );
};

export default Minions;
