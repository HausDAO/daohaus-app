import React, { useMemo, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { MaxUint256 } from '@ethersproject/constants';

import { useParams } from 'react-router-dom';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';

import { propStatusText } from '../data/proposalCardText';

import { readableTokenBalance } from '../utils/proposalCardUtils';
import { TX } from '../data/txLegos/contractTX';
import { PropActionBox, TopStatusBox } from './proposalActionPrimitives';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import SkeletonActionCard from './skeletonActionCard';

const Unsponsored = props => {
  const { proposal, isMember } = props;
  const { daoid } = useParams();
  const { daoOverview } = useDao();
  const { daoMember } = useDaoMember();
  const { address } = useInjectedProvider();

  const [isLoadingTx, setLoadingTx] = useState(false);
  const { submitTransaction } = useTX();

  const depositData = useMemo(() => {
    const { depositToken, proposalDeposit } = daoOverview || {};

    if (
      !daoMember.depositTokenData ||
      !depositToken?.decimals ||
      !depositToken.symbol ||
      !proposalDeposit
    )
      return;
    const { decimals, symbol, tokenAddress } = depositToken;
    const { allowance, balance } = daoMember.depositTokenData || {};
    const canSpend =
      Number(allowance) >= Number(proposalDeposit) ||
      Number(proposalDeposit) === 0;

    const hasBalance =
      Number(balance) >= Number(proposalDeposit) ||
      Number(proposalDeposit) === 0;

    return {
      deposit: readableTokenBalance({
        balance: proposalDeposit,
        decimals,
        symbol,
      }),
      userAllowance: Number(allowance),
      userBalance: Number(balance),
      decimals,
      address: tokenAddress,
      symbol,
      canSpend,
      hasBalance,
    };
  }, [daoOverview, daoMember, isMember, address]);

  const sponsorProposal = async () => {
    setLoadingTx(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.SPONSOR_PROPOSAL,
    });
    setLoadingTx(false);
  };
  const cancelProposal = async () => {
    setLoadingTx(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.CANCEL_PROPOSAL,
    });
    setLoadingTx(false);
  };
  const cancelMinion = async () => {
    setLoadingTx(true);
    if (proposal.escrow) {
      await submitTransaction({
        tx: TX.ESCROW_MINION_CANCEL,
        args: [proposal.proposalId, proposal.molochAddress],
      });
    } else {
      await submitTransaction({
        tx: TX.MINION_CANCEL,
        args: [proposal.proposalId],
        localValues: {
          minionAddress: proposal.minionAddress,
        },
      });
    }
    setLoadingTx(false);
  };
  const approveToken = async () => {
    setLoadingTx(true);
    const unlockAmount = MaxUint256.toString();
    await submitTransaction({
      args: [daoid, unlockAmount],
      tx: TX.UNLOCK_TOKEN,
      values: { tokenAddress: depositData.address, unlockAmount },
    });
    setLoadingTx(false);
  };

  if (isMember === null || !daoOverview) {
    return <SkeletonActionCard />;
  }
  if ((isMember === true && depositData?.canSpend) || isMember === false) {
    return (
      <SponsorCard
        isLoadingTx={isLoadingTx}
        cancelProposal={cancelProposal}
        cancelMinion={cancelMinion}
        sponsorProposal={sponsorProposal}
        address={address}
        depositData={depositData}
        {...props}
      />
    );
  }
  return (
    <UnlockTokenCard
      depositData={depositData}
      isLoadingTx={isLoadingTx}
      approveToken={approveToken}
      {...props}
    />
  );
};
export default Unsponsored;

const UnlockTokenCard = ({
  canInteract,
  approveToken,
  depositData,
  isLoadingTx,
}) => {
  return (
    <PropActionBox>
      <TopStatusBox
        status='Unsponsored | Approve Deposit Token'
        circleColor='green'
        helperText={
          depositData?.hasBalance
            ? propStatusText.approve(depositData?.symbol)
            : propStatusText.noFunds(depositData?.symbol)
        }
      />
      <Flex>
        <Button
          size='sm'
          fontWeight='700'
          minW='4rem'
          variant='outline'
          disabled={!canInteract || !depositData?.hasBalance}
          onClick={approveToken}
          isLoading={isLoadingTx}
        >
          Approve {depositData?.symbol}
        </Button>
      </Flex>
    </PropActionBox>
  );
};

const SponsorCard = ({
  isLoadingTx,
  cancelProposal,
  cancelMinion,
  sponsorProposal,
  depositData,
  proposal,
  canInteract,
  isMember,
  address,
}) => {
  return (
    <PropActionBox>
      <TopStatusBox
        status='Unsponsored'
        circleColor='green'
        helperText={
          depositData?.hasBalance
            ? propStatusText.Unsponsored
            : propStatusText.noFunds(depositData?.symbol)
        }
      />
      <Flex>
        <Button
          size='sm'
          minW='4rem'
          fontWeight='700'
          mr={['2', '2', 'auto']}
          disabled={!canInteract || !isMember || !depositData.hasBalance}
          onClick={sponsorProposal}
          isLoading={isLoadingTx}
        >
          Sponsor {depositData?.deposit && `(${depositData.deposit})`}
        </Button>
        {(proposal?.minionAddress &&
          proposal.proposer === proposal.minionAddress &&
          proposal.createdBy === proposal.minionAddress && (
            <Button
              size='sm'
              fontWeight='700'
              minW='4rem'
              variant='outline'
              onClick={cancelMinion}
              isLoading={isLoadingTx}
            >
              Cancel Minion
            </Button>
          )) ||
          (proposal?.minionAddress &&
            proposal.proposer === proposal.minionAddress &&
            proposal.createdBy === address && (
              <Button
                size='sm'
                fontWeight='700'
                minW='4rem'
                variant='outline'
                onClick={cancelMinion}
                isLoading={isLoadingTx}
              >
                Cancel Minion
              </Button>
            ))}
        {address?.toLowerCase() === proposal?.proposer?.toLowerCase() && (
          <Button
            size='sm'
            fontWeight='700'
            minW='4rem'
            variant='outline'
            onClick={cancelProposal}
            isLoading={isLoadingTx}
          >
            Cancel
          </Button>
        )}
      </Flex>
    </PropActionBox>
  );
};
