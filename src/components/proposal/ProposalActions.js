import React, { useState, useContext } from 'react';
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
    const [currentWallet] = useContext(CurrentWalletContext);
    const [daoService] = useContext(DaoServiceContext);

    const cancelProposal = async (id) => {
        setLoading(true);
        try {
            await daoService.mcDao.cancelProposal(id);
        } catch (err) {
            console.log('user rejected or transaction failed');
        } finally {
            setLoading(false);
            history.push(`/dao/${daoService.daoAddress}/proposals`);
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
            history.push(`/dao/${daoService.daoAddress}/proposals`);
        }
    };

    const unlock = async (token) => {
        console.log('unlock ', token);
        setLoading(true);
        const ul = await daoService.token.unlock(token);
        console.log(ul);

        setLoading(false);
    };

    console.log('currentWallet', currentWallet);


    return (
        <>
            <>
                {!proposal.sponsored &&
                    !proposal.cancelled &&
                    proposal.proposer.toLowerCase() ===
                    currentUser.username.toLowerCase() && (
                        <>
                            {loading ? (
                                <TinyLoader />
                            ) : (
                                    <button
                                        onClick={() => cancelProposal(proposal.proposalId)}
                                    >
                                        Cancel My Proposal
                      </button>
                                )}
                        </>
                    )}
                {currentWallet.allowance > 0 ? (
                    <>
                        {!proposal.sponsored &&
                            !proposal.cancelled &&
                            currentWallet.shares > 0 && (
                                <>
                                    {loading ? (
                                        <TinyLoader />
                                    ) : (
                                            <button
                                                onClick={() => sponsorProposal(proposal.proposalId)}
                                            >
                                                Sponsor Proposal
                      </button>
                                        )}
                                </>
                            )}
                    </>
                ) : (
                        <div className="UnlockButton" onClick={() => unlock('0xd0a1e359811322d97991e03f863a0c30c2cf029c')}>
                            {!loading ? <span>! Unlock</span> : <TinyLoader />}
                        </div>
                    )}
            </>
        </>
    );
};

export default withRouter(withApollo(ProposalActions));
