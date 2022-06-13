import {
  pollGuildFunds,
  pollMinionCancel,
  pollMinionSummon,
  pollMolochSummon,
  pollTokenAllowances,
  pollTokenApproval,
  withdrawTokenFetch,
  pollTXHash,
  pollBoostTXHash,
  pollMinionExecuteAction,
  pollWrapNZap,
  pollSupertokenCreated,
  pollPosterTXHash,
} from '../polls/polls';
import {
  guildFundTest,
  minionExecuteTest,
  minonSummonTest,
  molochSummonTest,
  tokenAllowanceTest,
  tokenApprovedTest,
  withdrawTokenTest,
  testTXHash,
  testWrapNZap,
  superTokenTest,
  testPosterTXHash,
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
  } else if (action === 'subgraph-poster') {
    return ({ chainID, actions, now, tx }) => txHash => {
      if (!tx) return;
      const args = { txHash, chainID, now, tx };
      startPoll({
        pollFetch: pollPosterTXHash,
        testFn: testPosterTXHash,
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
    return ({
      chainID,
      minionAddress,
      proposalId,
      actions,
      tx,
      proposalType,
    }) => txHash => {
      startPoll({
        pollFetch: pollMinionExecuteAction,
        testFn: minionExecuteTest,
        shouldEqual: true,
        args: {
          chainID,
          minionAddress,
          proposalId,
          tx,
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
          pollArgs: { chainID, minionAddress, proposalId, proposalType },
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
    // Review all params
  } else if (action === 'superTokenCreated') {
    return ({ chainID, createdAt, paymentToken, actions }) => txHash => {
      startPoll({
        pollFetch: pollSupertokenCreated,
        testFn: superTokenTest,
        shouldEqual: true,
        args: {
          chainID,
          underlyingTokenAddress: paymentToken,
          createdAt,
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
          resolvedMsg: 'Supertoken Created!',
          unresolvedMsg: 'Deploying Supertoken',
          successMsg: 'Supertoken Created Successfully!',
          errorMsg: `Error creating a Supertoken for ${paymentToken}`,
          pollData: {
            action,
            interval,
            tries,
          },
          pollArgs: {
            chainID,
            createdAt,
            underlyingTokenAddress: paymentToken,
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
  }
};
