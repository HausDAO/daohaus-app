import React, { useState, useContext, useEffect } from 'react';
import { withApollo } from 'react-apollo';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import { isMinion } from '../../utils/ProposalHelper';
import TinyLoader from '../shared/TinyLoader';

const ProposalActions = ({ client, proposal }) => {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
      currentUser.txProcessor.forceUpdate = true;
      setCurrentUser({ ...currentUser });
    }
  };

  useEffect(() => {
    const getDeposit = async () => {
      const propDeposit = await daoService.mcDao.getProposalDeposit();
      const symbol = await daoService.token.getSymbol();
      const decimals = await daoService.token.getDecimals();
      setDeposit(`${propDeposit / 10 ** decimals} ${symbol}`);
    };
    getDeposit();
    // eslint-disable-next-line
  }, []);

  const cancelProposal = async (id) => {
    setLoading(true);
    try {
      await daoService.mcDao.cancelProposal(id, txCallBack);
    } catch (err) {
      console.log('user rejected or transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const sponsorProposal = async (id) => {
    console.log('sponsor ', id);
    // setLoading(true);
    try {
      await daoService.mcDao.sponsorProposal(id, txCallBack);
    } catch (err) {
      console.log('user rejected or transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const unlock = async (token) => {
    console.log('unlock ', token);
    setLoading(true);
    try {
      await daoService.token.unlock(token);
    } catch {
      console.log('failes');
    } finally {
      setLoading(false);
    }
  };

  const minionDetails = isMinion(proposal);
  const isMinionProposal =
    minionDetails.isMinion || minionDetails.isTransmutation;

  return (
    <>
      {loading ? (
        <button>
          <TinyLoader />
        </button>
      ) : (
        <>
          {!isMinionProposal &&
            !proposal.sponsored &&
            !proposal.cancelled &&
            proposal.proposer.toLowerCase() ===
              currentUser.username.toLowerCase() && (
              <button onClick={() => cancelProposal(proposal.proposalId)}>
                <span>Cancel My Proposal</span>
              </button>
            )}
          {currentWallet.allowance > 0 ? (
            <>
              {!proposal.sponsored &&
                !proposal.cancelled &&
                currentWallet.shares > 0 && (
                  <button onClick={() => sponsorProposal(proposal.proposalId)}>
                    <span>Sponsor Proposal ({deposit})</span>
                  </button>
                )}
            </>
          ) : (
            <button
              className="UnlockButton"
              onClick={() => unlock(proposal.moloch.depositToken.tokenAddress)}
            >
              <span>Unlock Token To Sponsor</span>
            </button>
          )}
        </>
      )}
    </>
  );
};

export default withApollo(ProposalActions);
