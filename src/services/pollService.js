import {
  pollDelegateRewards,
  pollGuildFunds,
  pollMinionCancel,
  pollMinionProposal,
  pollMinionSummon,
  pollMolochSummon,
  pollTokenAllowances,
  pollTokenApproval,
  pollUberHausDelegateSet,
  withdrawTokenFetch,
  pollTXHash,
  pollBoostTXHash,
  pollMinionExecuteAction,
  pollWrapNZap,
} from '../polls/polls';
import {
  checkDelRewardsTest,
  guildFundTest,
  minionExecuteTest,
  minonProposalTest,
  minonSummonTest,
  molochSummonTest,
  tokenAllowanceTest,
  tokenApprovedTest,
  uberHausDelegateSetTest,
  withdrawTokenTest,
  testTXHash,
  testWrapNZap,
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
  } else if (action === 'subgraph') {
    return ({ chainID, actions, now, tx }) => txHash => {
      if (!tx) return;
      const args = { txHash, chainID, now, tx };
      startPoll({
        pollFetch: pollTXHash,
        testFn: testTXHash,
        shouldEqual: txHash,
        args,
        actions,
        txHash,
      });
      cachePoll?.({
        txHash,
        action,
        timeSent: now,
        status: 'unresolved',
        resolvedMsg: tx.successMsg,
        unresolvedMsg: 'Processing',
        successMsg: tx.successMsg,
        errorMsg: tx.errMsg,
        pollData: {
          action,
          interval,
          tries,
        },
        pollArgs: args,
      });
    };
    // NEW TX specialPoll
  } else if (action === 'pollWrapNZap') {
    return ({ chainID, contractAddress, actions, now, tx }) => txHash => {
      if (!tx) return;
      const args = { txHash, chainID, contractAddress, now, tx };
      startPoll({
        pollFetch: pollWrapNZap,
        testFn: testWrapNZap,
        shouldEqual: '0',
        args,
        actions,
        txHash,
      });
      cachePoll?.({
        txHash,
        action,
        timeSent: now,
        status: 'unresolved',
        resolvedMsg: tx.successMsg,
        unresolvedMsg: 'Processing',
        successMsg: tx.successMsg,
        errorMsg: tx.errMsg,
        pollData: {
          action,
          interval,
          tries,
        },
        pollArgs: args,
      });
    };
    // NEW TX specialPoll
  } else if (action === 'boostSubgraph') {
    return ({ chainID, actions, now, tx }) => txHash => {
      if (!tx) return;
      const args = { txHash, chainID, now, tx };
      startPoll({
        pollFetch: pollBoostTXHash,
        testFn: testTXHash,
        shouldEqual: txHash,
        args,
        actions,
        txHash,
      });
      cachePoll?.({
        txHash,
        action,
        timeSent: now,
        status: 'unresolved',
        resolvedMsg: tx.successMsg,
        unresolvedMsg: 'Processing',
        successMsg: tx.successMsg,
        errorMsg: tx.errMsg,
        pollData: {
          action,
          interval,
          tries,
        },
        pollArgs: args,
      });
    };
    // NEW TX specialPoll
  } else if (action === 'executeAction') {
    console.log('set poll');
    return ({ chainID, minionAddress, proposalId, actions, tx }) => txHash => {
      startPoll({
        pollFetch: pollMinionExecuteAction,
        testFn: minionExecuteTest,
        shouldEqual: true,
        args: {
          chainID,
          minionAddress,
          proposalId,
          tx,
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
  } else if (action === 'unlockToken') {
    return ({
      daoID,
      chainID,
      tokenAddress,
      userAddress,
      unlockAmount,
      address,
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
          userAddress: userAddress || address,
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
            userAddress: userAddress || address,
            unlockAmount,
          },
        });
      }
    };
  } else if (action === 'approveAllTokens') {
    return ({
      daoID,
      chainID,
      userAddress,
      contractAddress,
      controllerAddress,
      address,
      actions,
    }) => txHash => {
      startPoll({
        pollFetch: pollTokenApproval,
        testFn: tokenApprovedTest,
        shouldEqual: true,
        args: {
          daoID,
          chainID,
          contractAddress,
          userAddress: userAddress || address,
          controllerAddress,
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
            contractAddress,
            chainID,
            userAddress: userAddress || address,
            controllerAddress,
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
        testFn: minionExecuteTest, // TODO: wrong test
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
  }
};
