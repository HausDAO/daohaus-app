import React, { useState, useContext, useEffect } from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import TinyLoader from '../shared/TinyLoader';

const ProposalActions = ({ client, proposal, history }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);

  useEffect(() => {
    const getDeposit = async () => {
      const propDeposit = await daoService.mcDao.getProposalDeposit();
      const symbol = await daoService.token.getSymbol();
      const decimals = await daoService.token.getDecimals();
      setDeposit(`${propDeposit / 10 ** decimals} ${symbol}`);
    }
    getDeposit();
    // eslint-disable-next-line
  }, [])

  const cancelProposal = async (id) => {
    setLoading(true);
    try {
      await daoService.mcDao.cancelProposal(id);
    } catch (err) {
      console.log('user rejected or transaction failed');
    } finally {
      setLoading(false);
      history.push(`/dao/${daoService.daoAddress}/success?action=cancelled`);
    }
  };

  const sponsorProposal = async (id) => {
    console.log('sponsor ', id);
    setLoading(true);
    try {
      await daoService.mcDao.sponsorProposal(id);
    } catch (err) {
      console.log('user rejected or transaction failed');
    } finally {
      setLoading(false);
      history.push(`/dao/${daoService.daoAddress}/success?action=sponsored`);
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

  return (
    <>
      {loading ? (
        <button>
          <TinyLoader />
        </button>
      ) : (
          <>
            {!proposal.sponsored &&
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

export default withRouter(withApollo(ProposalActions));
