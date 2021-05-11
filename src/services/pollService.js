import {
  pollDelegateRewards,
  pollGuildFunds,
  pollMinionExecute,
  pollMinionCancel,
  pollMinionProposal,
  pollMinionSummon,
  pollMolochSummon,
  pollProposals,
  pollRageQuit,
  pollTokenAllowances,
  pollUberHausDelegateSet,
  syncTokenPoll,
  updateDelegateFetch,
  withdrawTokenFetch,
  pollRageKick,
  pollWrapNZapSummon,
} from '../polls/polls';
import {
  cancelProposalTest,
  checkDelRewardsTest,
  collectTokenTest,
  guildFundTest,
  minionExecuteTest,
  minonProposalTest,
  minonSummonTest,
  molochSummonTest,
  processProposalTest,
  rageQuitTest,
  sponsorProposalTest,
  submitProposalTest,
  submitVoteTest,
  tokenAllowanceTest,
  uberHausDelegateSetTest,
  updateDelegateTest,
  withdrawTokenTest,
  rageKickTest,
  wrapNZapSummonTest,
} from '../polls/tests';

export const createPoll = ({
  interval = 2000,
  tries = 30,
  action = null,
  cachePoll = null,
}) => {
  /// ////////////////////GENERIC POLL//////////////////
  const startPoll = ({
    pollFetch,
    testFn,
    shouldEqual,
    args,
    actions,
    txHash,
  }) => {
    let tryCount = 0;
    const pollId = setInterval(async () => {
      if (tryCount < tries) {
        try {
          const res = await pollFetch(args);
          console.log('Fetch Result', res);
          console.log('ShouldEqual', shouldEqual);
          const testResult = testFn(res, shouldEqual, pollId);
          console.log('Test Result', testResult);
          if (testResult) {
            clearInterval(pollId);
            actions.onSuccess(txHash);
            return res;
          }
          tryCount += 1;
        } catch (error) {
          console.error(error);
          actions.onError(error, txHash);
          clearInterval(pollId);
        }
      } else {
        actions.onError('Ran out of tries', txHash);
        clearInterval(pollId);
      }
    }, interval);
    return pollId;
  };
  /// /////////////////ACTIONS//////////////////////////
  if (!action) {
    throw new Error('User must submit an action argument');
  } else if (
    action === 'submitProposal' ||
    action === 'submitWhitelistProposal' ||
    action === 'submitGuildKickProposal'
  ) {
    return ({ daoID, chainID, hash, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitProposalTest,
        shouldEqual: hash,
        args: { daoID, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Submitted proposal',
          unresolvedMsg: 'Submitting proposal',
          successMsg: `Proposal Submitted to ${daoID} on ${chainID}`,
          errorMsg: `Error Submitting proposal ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            hash,
          },
        });
      }
    };
  } else if (action === 'submitProposalCco') {
    return ({ daoID, chainID, hash, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitProposalTest,
        shouldEqual: hash,
        args: { daoID, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Contribution submitted',
          unresolvedMsg: 'Contribution pending',
          successMsg: 'Contribution submission complete',
          errorMsg: 'Error submitting contribution',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            hash,
          },
        });
      }
    };
  } else if (action === 'unlockToken' || action === 'approveUberHaus') {
    return ({
      daoID,
      chainID,
      tokenAddress,
      userAddress,
      unlockAmount,
      actions,
    }) => txHash => {
      startPoll({
        pollFetch: pollTokenAllowances,
        testFn: tokenAllowanceTest,
        shouldEqual: unlockAmount,
        args: {
          daoID,
          chainID,
          tokenAddress,
          userAddress,
          unlockAmount,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Unlocked Token',
          unresolvedMsg: 'Unlocking token',
          successMsg: `Unlocking token for ${daoID} on ${chainID}`,
          errorMsg: `Error unlocking token for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            tokenAddress,
            chainID,
            userAddress,
            unlockAmount,
          },
        });
      }
    };
  } else if (action === 'sponsorProposal') {
    return ({ daoID, chainID, proposalId, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: sponsorProposalTest,
        shouldEqual: proposalId,
        args: { daoID, chainID, proposalId },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Sponsored proposal',
          unresolvedMsg: 'Sponsoring proposal',
          successMsg: `Proposal #${proposalId} Sponsored for ${daoID} on ${chainID}`,
          errorMsg: `Error Sponsoring proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
          },
        });
      }
    };
  } else if (action === 'submitVote') {
    return ({ daoID, chainID, proposalId, userAddress, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitVoteTest,
        shouldEqual: [proposalId, userAddress],
        args: {
          daoID,
          chainID,
          proposalId,
          userAddress,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: `Voted on proposal #${proposalId}`,
          unresolvedMsg: `Voted on proposal #${proposalId}`,
          successMsg: `Voted on proposal #${proposalId} for ${daoID} on ${chainID}`,
          errorMsg: `Error voting on proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
            userAddress,
          },
        });
      }
    };
  } else if (action === 'processProposal') {
    return ({ daoID, chainID, proposalIndex, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: processProposalTest,
        shouldEqual: proposalIndex,
        args: { daoID, chainID, proposalIndex },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Processed proposal',
          unresolvedMsg: 'Processing proposal',
          successMsg: `Proposal #${proposalIndex} Processed for ${daoID} on ${chainID}`,
          errorMsg: `Error Sponsoring proposal #${proposalIndex} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalIndex,
          },
        });
      }
    };
  } else if (action === 'cancelProposal') {
    return ({ daoID, chainID, proposalId, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: cancelProposalTest,
        shouldEqual: proposalId,
        args: { daoID, chainID, proposalId },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Cancelled proposal',
          unresolvedMsg: 'Cancelling proposal',
          successMsg: `Proposal #${proposalId} Cancelled for ${daoID} on ${chainID}`,
          errorMsg: `Error Cancelling proposal #${proposalId} for ${daoID} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            daoID,
            chainID,
            proposalId,
          },
        });
      }
    };
  } else if (action === 'summonMoloch') {
    return ({ chainID, summoner, createdAt, actions }) => txHash => {
      startPoll({
        pollFetch: pollMolochSummon,
        testFn: molochSummonTest,
        shouldEqual: { summoner, createdAt },
        args: { chainID, summoner, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'DAO summoned',
          unresolvedMsg: 'Summoning DAO',
          successMsg: `A New DAO has Risen on ${chainID}`,
          errorMsg: `Error summoning DAO on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, summoner, createdAt },
        });
      }
    };
  } else if (action === 'collectTokens') {
    return ({ token, actions, chainID, daoID }) => txHash => {
      if (!token?.contractBalances?.token) {
        throw new Error(
          'token object does not contain .contractBalances.token',
        );
      }
      if (!token?.moloch?.version) {
        throw new Error('token object does not contain .moloch.version');
      }
      startPoll({
        pollFetch: syncTokenPoll,
        testFn: collectTokenTest,
        shouldEqual: token.tokenBalance,
        args: {
          chainID,
          daoID,
          daoVersion: token?.moloch?.version,
          tokenAddress: token?.tokenAddress,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Token Value Synced',
          unresolvedMsg: 'Syncing Token Value',
          successMsg: 'Token value has been synced',
          errorMsg: 'Error syncing token value',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            daoID,
            token,
          },
        });
      }
    };
  } else if (action === 'minionCrossWithdraw') {
    return ({
      tokenAddress,
      memberAddress,
      actions,
      chainID,
      daoID,
      uber,
      expectedBalance,
    }) => txHash => {
      console.log('Create Poll');
      startPoll({
        pollFetch: withdrawTokenFetch,
        testFn: withdrawTokenTest,
        shouldEqual: expectedBalance || 0,
        args: {
          tokenAddress,
          memberAddress,
          chainID,
          daoID,
          uber,
          expectedBalance,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Withdrew Tokens',
          unresolvedMsg: 'Withdrawing tokens',
          successMsg: 'Successfully withdrew tokens!',
          errorMsg: 'There was an error withdrawing tokens',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            daoID,
            memberAddress,
            tokenAddress,
            shouldEqual: uber ? expectedBalance : 0,
          },
        });
      }
    };
  } else if (action === 'minionProposeAction') {
    return ({ minionAddress, createdAt, chainID, actions }) => txHash => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: createdAt,
        args: { minionAddress, chainID, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Minion proposal submitted',
          unresolvedMsg: 'Submitting minion proposal',
          successMsg: `Minion proposal submitted for ${minionAddress} on ${chainID}`,
          errorMsg: `Error submitting minion proposal for ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { minionAddress, createdAt, chainID },
        });
      }
    };
  } else if (action === 'uberHausProposeAction') {
    return ({ minionAddress, createdAt, chainID, actions }) => txHash => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: createdAt,
        args: { minionAddress, chainID, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'UberHAUS proposal submitted',
          unresolvedMsg: 'Submitting UberHAUS proposal',
          successMsg: `UberHAUS proposal submitted for ${minionAddress} on ${chainID}`,
          errorMsg: `Error submitting minion proposal for ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { minionAddress, createdAt, chainID },
        });
      }
    };
  } else if (action === 'superfluidProposeAction') {
    return ({ minionAddress, createdAt, chainID, actions }) => txHash => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: createdAt,
        args: { minionAddress, chainID, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Superfluid proposal submitted',
          unresolvedMsg: 'Submitting Superfluid proposal',
          successMsg: `Superfluid proposal submitted for ${minionAddress} on ${chainID}`,
          errorMsg: `Error submitting minion proposal for ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { minionAddress, createdAt, chainID },
        });
      }
    };
  } else if (action === 'superfluidWithdrawBalance') {
    return ({
      minionAddress,
      tokenAddress,
      expectedBalance,
      chainID,
      actions,
    }) => txHash => {
      startPoll({
        pollFetch: pollGuildFunds,
        testFn: guildFundTest,
        shouldEqual: expectedBalance,
        args: {
          chainID,
          uberMinionAddress: minionAddress,
          tokenAddress,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Token outstanding balance returned to your DAO',
          unresolvedMsg: 'Withdrawing token balance',
          successMsg: `Token balance withdrawn from ${minionAddress} on ${chainID}`,
          errorMsg: `Error withdrawing token balance from ${minionAddress} on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            minionAddress,
            tokenAddress,
            expectedBalance,
            chainID,
          },
        });
      }
    };
  } else if (action === 'minionExecuteAction') {
    return ({
      chainID,
      minionAddress,
      proposalId,
      actions,
      proposalType,
    }) => txHash => {
      startPoll({
        pollFetch: pollMinionExecute,
        testFn: minionExecuteTest,
        shouldEqual: true,
        args: {
          chainID,
          minionAddress,
          proposalId,
          proposalType,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Minion proposal executed',
          unresolvedMsg: 'Executing minion proposal',
          successMsg: `Executed minion proposal on ${chainID}`,
          errorMsg: `Error executing minion proposal on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress, proposalId },
        });
      }
    };
  } else if (action === 'minionCancelAction') {
    return ({
      chainID,
      minionAddress,
      proposalId,
      actions,
      proposalType,
    }) => txHash => {
      startPoll({
        pollFetch: pollMinionCancel,
        testFn: minionExecuteTest,
        shouldEqual: true,
        args: {
          chainID,
          minionAddress,
          proposalId,
          proposalType,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Minion action canceled',
          unresolvedMsg: 'Canceling minion action',
          successMsg: `Canceled minion proposal on ${chainID}`,
          errorMsg: `Error canceling minion proposal on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress, proposalId },
        });
      }
    };
  } else if (action === 'transmutationProposal') {
    return ({ daoID, chainID, hash, actions }) => txHash => {
      startPoll({
        pollFetch: pollProposals,
        testFn: submitProposalTest,
        shouldEqual: hash,
        args: { daoID, chainID, hash },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Transmutation proposal submitted',
          unresolvedMsg: 'Submitting transmutation proposal',
          successMsg: `A new transmutation proposal has been submitted on ${chainID}`,
          errorMsg: `Error submitting transmutation proposal on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { daoID, chainID, hash },
        });
      }
    };
  } else if (action === 'summonMinion') {
    return ({ chainID, molochAddress, createdAt, actions }) => txHash => {
      startPoll({
        pollFetch: pollMinionSummon,
        testFn: minonSummonTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Minion summoned',
          unresolvedMsg: 'Summoning Minion',
          successMsg: `A New Minion has Risen on ${chainID}`,
          errorMsg: `Error summoning Minion on ${chainID}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'withdrawBalance') {
    return ({
      tokenAddress,
      memberAddress,
      actions,
      chainID,
      daoID,
      uber,
      expectedBalance,
    }) => txHash => {
      startPoll({
        pollFetch: withdrawTokenFetch,
        testFn: withdrawTokenTest,
        shouldEqual: expectedBalance || 0,
        args: {
          tokenAddress,
          memberAddress,
          chainID,
          daoID,
          uber,
          expectedBalance,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Withdrew Tokens',
          unresolvedMsg: 'Withdrawing tokens',
          successMsg: 'Successfully withdrew tokens!',
          errorMsg: 'There was an error withdrawing tokens',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            daoID,
            memberAddress,
            tokenAddress,
            shouldEqual: uber ? expectedBalance : 0,
          },
        });
      }
    };
  } else if (action === 'pullGuildFunds') {
    return ({
      tokenAddress,
      actions,
      chainID,
      uberMinionAddress,
      expectedBalance,
    }) => txHash => {
      startPoll({
        pollFetch: pollGuildFunds,
        testFn: guildFundTest,
        shouldEqual: expectedBalance,
        args: {
          chainID,
          uberMinionAddress,
          tokenAddress,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Pulled Tokens to Guild Bank',
          unresolvedMsg: 'Pulling tokens from UberHUAS Minion',
          successMsg: 'Successfully pulled tokens!',
          errorMsg: 'There was an error withdrawing tokens',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            uberMinionAddress,
            expectedBalance,
            tokenAddress,
          },
        });
      }
    };
  } else if (action === 'ragequit') {
    return ({ chainID, molochAddress, createdAt, actions }) => txHash => {
      startPoll({
        pollFetch: pollRageQuit,
        testFn: rageQuitTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Rage Quit Completed',
          unresolvedMsg: 'Rage Quitting',
          successMsg: 'You Rage Quit',
          errorMsg: 'Error Rage Quitting',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'ragequitClaim') {
    return ({ chainID, molochAddress, createdAt, actions }) => txHash => {
      startPoll({
        pollFetch: pollRageQuit,
        testFn: rageQuitTest,
        shouldEqual: { molochAddress, createdAt },
        args: { chainID, molochAddress, createdAt },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Claim Completed',
          unresolvedMsg: 'Claiming',
          successMsg: 'Claim Completed. You got your $HAUS',
          errorMsg: 'Error Claiming',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, molochAddress, createdAt },
        });
      }
    };
  } else if (action === 'updateDelegateKey') {
    return ({
      chainID,
      daoID,
      memberAddress,
      delegateAddress,
      actions,
    }) => txHash => {
      startPoll({
        pollFetch: updateDelegateFetch,
        testFn: updateDelegateTest,
        shouldEqual: delegateAddress,
        args: { chainID, daoID, memberAddress },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Delegate has been updated',
          unresolvedMsg: 'Updating delegate',
          successMsg: `Updated delegate address to ${delegateAddress}`,
          errorMsg: 'Poll error on updateDelegate',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            daoID,
            memberAddress,
            delegateAddress,
          },
        });
      }
    };
  } else if (action === 'uberHausNominateDelegate') {
    return ({
      chainID,
      minionAddress,
      newDelegateAddress,
      actions,
      createdAt,
    }) => txHash => {
      startPoll({
        pollFetch: pollMinionProposal,
        testFn: minonProposalTest,
        shouldEqual: newDelegateAddress,
        args: { createdAt, minionAddress, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Created uberHAUS delegate proposal',
          unresolvedMsg: 'Creating proposal',
          successMsg: 'Created uberHAUS delegate proposal',
          errorMsg: 'Poll error on nominateDelegate',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress },
        });
      }
    };
  } else if (action === 'setInitialDelegate') {
    return ({
      chainID,
      minionAddress,
      uberHausAddress,
      delegateAddress,
      actions,
    }) => txHash => {
      startPoll({
        pollFetch: pollUberHausDelegateSet,
        testFn: uberHausDelegateSetTest,
        shouldEqual: delegateAddress,
        args: {
          uberHausAddress,
          minionAddress,
          delegateAddress,
          chainID,
        },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'UberHAUS delegate set',
          unresolvedMsg: 'Setting UberHAUS delegate',
          successMsg: 'Set UberHAUS delegate',
          errorMsg: 'Poll error on setInitialDelegate',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, minionAddress },
        });
      }
    };
  } else if (action === 'claimDelegateReward') {
    return ({
      chainID,
      uberMinionAddress,
      delegateAddress,
      actions,
    }) => txHash => {
      console.log('In Start Poll');
      console.log('chainID', chainID);
      console.log('uberMinionAddress', uberMinionAddress);
      console.log('delegateAddres', delegateAddress);
      console.log('actions', actions);
      console.log('action', action);
      console.log('txHash', txHash);

      startPoll({
        pollFetch: pollDelegateRewards,
        testFn: checkDelRewardsTest,
        args: { uberMinionAddress, delegateAddress, chainID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'UberHAUS delegate rewards claimed',
          unresolvedMsg: 'Claiming UberHAUS delegate rewards',
          successMsg: 'UberHAUS delegate rewards claimed',
          errorMsg: 'Poll error on claimDelegateReward',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, uberMinionAddress, delegateAddress },
        });
      }
    };
  } else if (action === 'ragekick') {
    return ({ chainID, daoID, memberAddress, actions }) => txHash => {
      startPoll({
        pollFetch: pollRageKick,
        testFn: rageKickTest,
        shouldEqual: { daoID, memberAddress },
        args: { chainID, daoID, memberAddress },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Rage Kick Completed',
          unresolvedMsg: 'Rage Kicking',
          successMsg: 'You Rage Kicked',
          errorMsg: 'Error Rage Kicking',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, daoID, memberAddress },
        });
      }
    };
  } else if (action === 'wrapNZapSummon') {
    return ({ chainID, daoID, actions }) => txHash => {
      startPoll({
        pollFetch: pollWrapNZapSummon,
        testFn: wrapNZapSummonTest,
        shouldEqual: { daoID },
        args: { chainID, daoID },
        actions,
        txHash,
      });
      if (cachePoll) {
        cachePoll({
          txHash,
          action,
          timeSent: Date.now(),
          status: 'unresolved',
          resolvedMsg: 'Successfully summoned Wrap-n-Zap',
          unresolvedMsg: 'Summoning Wrap-N-Zap',
          successMsg: 'Summoned Wrap-N-Zap',
          errorMsg: 'Error summoning Wrap-N-Zap',
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: { chainID, daoID },
        });
      }
    };
  }
};
