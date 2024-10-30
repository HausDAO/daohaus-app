import Web3 from 'web3';

import SuperfluidMinionAbi from '../contracts/superfluidMinion.json';
import {
  MINION_STREAMS,
  SF_ACTIVE_STREAMS,
  SF_STREAMS,
  SF_STREAMS_V2,
} from '../graphQL/superfluid-queries';
import { graphQuery } from '../utils/apollo';
import { chainByID, getGraphEndpoint } from '../utils/chain';
import { createContract } from '../utils/contract';
import { MINION_TYPES } from '../utils/proposalUtils';
import { isSupertoken } from '../utils/superfluid';
import { graphFetchAll } from '../utils/theGraph';
// MUST be imported at the end to avoid `referenceerror cannot access MINION_TYPES before initialization` error
import { LOCAL_ABI } from '../utils/abi';

const getSuperTokenBalances = async (chainID, minion, tokens) => {
  try {
    const tokenBalances = tokens.map(async token => {
      const tokenContract = createContract({
        address: token.superTokenAddress,
        abi: LOCAL_ABI.ERC_20,
        chainID,
      });
      const tokenSymbol = await tokenContract.methods.symbol().call();
      const tokenBalance = await tokenContract.methods.balanceOf(minion).call();
      const tokenDecimals = await tokenContract.methods.decimals().call();
      const superTokenInfo = await isSupertoken(
        chainID,
        token.superTokenAddress,
      );

      return {
        [token.superTokenAddress]: {
          tokenBalance,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          registeredToken:
            superTokenInfo.superTokenAddress === token.superTokenAddress,
          underlyingTokenAddress:
            token.underlyingTokenAddress !== token.superTokenAddress &&
            token.underlyingTokenAddress,
          _service: tokenContract,
        },
      };
    });
    return Object.assign({}, ...(await Promise.all(tokenBalances)));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const SuperfluidMinionService = ({
  chainID,
  minion,
  minionType,
  web3,
}) => {
  const chainConfig = chainByID(chainID);
  if (!web3) {
    const rpcUrl = chainConfig.rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  const minionContract = new web3.eth.Contract(SuperfluidMinionAbi, minion);

  return function getService(service) {
    if (service === 'fetchStreams') {
      return async ({ molochAddress }) => {
        try {
          const superfluidConfig = chainConfig.superfluid;
          if (!superfluidConfig) {
            throw Error(
              `Superfluid minion not available in ${chainID} network`,
            );
          }

          const now = new Date();
          if (minionType === MINION_TYPES.SAFE) {
            const sfAccount = await graphQuery({
              endpoint: superfluidConfig.subgraph_url_v2,
              query: SF_STREAMS_V2,
              variables: {
                ownerAddress: minion,
              },
            });
            const sfInflows = sfAccount?.account?.inflows || [];
            const sfOutflows = sfAccount?.account?.outflows || [];
            const tokens = Array.from(
              new Set([
                ...(sfInflows.map(s => s.token.id) || []),
                ...(sfOutflows.map(s => s.token.id) || []),
              ]),
            ).map(token => {
              const s =
                sfOutflows.find(s => s.token.id === token) ||
                sfInflows.find(s => s.token.id === token);
              return {
                superTokenAddress: s.token.id,
                underlyingTokenAddress: s.token.underlyingAddress,
              };
            });
            const superTokens = await getSuperTokenBalances(
              chainID,
              minion,
              tokens,
            );
            const flows = await Promise.all(
              sfOutflows.map(async outStream => {
                const decimals = superTokens[outStream.token.id]?.decimals;
                const createdEvent = outStream.flowUpdatedEvents.find(
                  e => e.type === 0,
                );
                const stoppedEvent = outStream.flowUpdatedEvents.find(
                  e => e.type === 2,
                );
                // TODO: what if multiple stopped events?
                const active = !stoppedEvent;
                const createdIndexRegx = createdEvent.id.match(
                  /FlowUpdated-0x[\w\d]{64}-([0-9]+)/,
                );
                if (active) {
                  // TODO: consider flowRate update (e.g. updatedAtTimestamp > createdAtTimestamp)
                  const netFlow =
                    (Number(outStream.currentFlowRate) *
                      ((now - new Date(outStream.createdAtTimestamp * 1000)) /
                        1000)) /
                    10 ** decimals;
                  return {
                    ...outStream,
                    active,
                    netFlow,
                    createdTxHash: createdEvent.transactionHash,
                    createdIdx:
                      createdIndexRegx?.length === 2 && createdIndexRegx[1],
                  };
                }
                return {
                  ...outStream,
                  active,
                  netFlow:
                    Number(outStream.streamedUntilUpdatedAt) / 10 ** decimals,
                  createdTxHash: createdEvent.transactionHash,
                  createdIdx:
                    createdIndexRegx?.length === 2 && createdIndexRegx[1],
                };
              }),
            );

            return {
              flows,
              superTokens,
            };
          }

          const streams = await graphFetchAll({
            endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
            query: MINION_STREAMS,
            variables: {
              minionId: `${molochAddress}-minion-${minion}`,
            },
            subfield: 'minionStreams',
          });

          const sfAccount = await graphQuery({
            endpoint: superfluidConfig.subgraph_url,
            query: SF_STREAMS,
            variables: {
              ownerAddress: minion,
            },
          });
          const sfInStreams = sfAccount?.account?.flowsReceived;
          const sfOutStreams = sfAccount?.account?.flowsOwned;
          const tokens = Array.from(
            new Set([
              ...(sfInStreams?.map(s => s.token.id) || []),
              ...(sfOutStreams?.map(s => s.token.id) || []),
            ]),
          ).map(token => {
            const s =
              sfOutStreams.find(s => s.token.id === token) ||
              sfInStreams.find(s => s.token.id === token);
            return {
              superTokenAddress: s.token.id,
              underlyingTokenAddress: s.token.underlyingAddress,
            };
          });
          const superTokens = await getSuperTokenBalances(
            chainID,
            minion,
            tokens,
          );

          if (!streams.length) {
            return {
              flows: [],
              superTokens,
            };
          }

          const flows = await Promise.all(
            streams.map(async stream => {
              if (stream.executed) {
                const decimals =
                  superTokens[stream.superTokenAddress]?.decimals;
                const sfStream = sfOutStreams.find(
                  s =>
                    s.recipient.id === stream.to &&
                    s.token.id === stream.superTokenAddress,
                );
                const nextFUEvent = sfStream.events.find(
                  (e, i) =>
                    i > 0 &&
                    sfStream.events[i - 1].transaction.blockNumber ===
                      stream.executedBlock,
                );
                if (nextFUEvent) {
                  // Stream was stopped or liquidated
                  const netFlow = Number(nextFUEvent.sum) / 10 ** decimals;
                  return {
                    ...stream,
                    liquidated: stream.active,
                    netFlow,
                  };
                }
                const netFlow = stream.active
                  ? (Number(stream.rate) *
                      ((now - new Date(stream.executedAt * 1000)) / 1000)) /
                    10 ** decimals
                  : (Number(stream.rate) *
                      (Number(stream.canceledAt) - Number(stream.executedAt))) /
                    10 ** decimals;
                return {
                  ...stream,
                  netFlow,
                };
              }
              return stream;
            }),
          );
          return {
            flows: flows.sort((a, b) => b.createdAt - a.createdAt),
            superTokens,
          };
        } catch (error) {
          console.error(error);
        }
      };
    }

    if (service === 'hasActiveStreams') {
      return async ({ to, tokenAddress }) => {
        const superfluidConfig = chainConfig.superfluid;
        if (!superfluidConfig) {
          throw Error(`Superfluid minion not available in ${chainID} network`);
        }
        const accountStreams = await graphQuery({
          endpoint: superfluidConfig.subgraph_url,
          query: SF_ACTIVE_STREAMS,
          variables: {
            ownerAddress: minion,
            recipientAddress: to.toLowerCase(),
          },
        });
        const activeStreams = accountStreams?.account?.flowsOwned;
        return !!activeStreams?.find(
          s => s.token?.underlyingAddress === tokenAddress,
        );
      };
    }
    if (service === 'getStream') {
      return async ({ proposalId }) => {
        const action = await minionContract.methods.streams(proposalId).call();
        return action;
      };
    }
    // proposeAction args: [ to, token, rate, minDeposit, ctx, details ]
    // executeAction args: [ proposal id ]
    // cancelAction args: [ proposal id ]
    // cancelStream args: [ proposal id ]
    // upgradeToken args: [ token, value ]
    // withdrawRemainingFunds args: [ superToken, downgrade ]
    if (
      service === 'proposeAction' ||
      service === 'executeAction' ||
      service === 'cancelAction' ||
      service === 'cancelStream' ||
      service === 'upgradeToken' ||
      service === 'withdrawRemainingFunds'
    ) {
      return async ({ args, address, poll, onTxHash }) => {
        const tx = await minionContract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              onTxHash();
              poll(txHash);
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
  };
};
