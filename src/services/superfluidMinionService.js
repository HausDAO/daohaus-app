import { id } from '@ethersproject/hash';
import { constants } from 'ethers';
import Web3 from 'web3';

import ConstantFlowAgreementAbi from '../contracts/iConstantFlowAgreementV1.json';
import SuperfluidMinionAbi from '../contracts/superfluidMinion.json';
import SuperfluidAbi from '../contracts/iSuperfluid.json';
import SuperfluidResolverAbi from '../contracts/iSuperfluidResolver.json';
import { SUPERFLUID_MINION_STREAMS, SUPERFLUID_ACTIVE_STREAMS_TO } from '../graphQL/superfluid-queries';
import { TokenService } from './tokenService';
import { chainByID, getGraphEndpoint } from '../utils/chain';
import { graphFetchAll } from '../utils/theGraph';

const getSuperTokenBalances = async (
  chainID,
  minion,
  sfResolver,
  sfVersion,
  superTokens,
) => {
  try {
    const tokenBalances = superTokens.map(async (tokenAddress) => {
      const tokenService = TokenService({
        tokenAddress,
        chainID,
      });
      const tokenSymbol = await tokenService('symbol')();
      const sToken = await sfResolver.methods.get(
        `supertokens.${sfVersion}.${tokenSymbol}`,
      ).call();
      return {
        [tokenAddress]: {
          tokenBalance: await tokenService('balanceOf')(minion),
          symbol: tokenSymbol,
          decimals: await tokenService('decimals')(),
          registeredToken: sToken !== constants.AddressZero,
          _service: tokenService,
        },
      };
    });
    return Object.assign({}, ...(await Promise.all(tokenBalances)));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const SuperfluidMinionService = ({ web3, minion, chainID }) => {
  const chainConfig = chainByID(chainID);
  if (!web3) {
    const rpcUrl = chainConfig.rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  const minionContract = new web3.eth.Contract(SuperfluidMinionAbi, minion);

  return function getService(service) {
    if (service === 'fetchStreams') {
      return async ({ molochAddress }) => {
        const superfluidConfig = chainConfig.superfluid;
        if (!superfluidConfig) {
          throw Error(`Superfluid minion not available in ${chainID} network`);
        }
        const sfHost = new web3.eth.Contract(SuperfluidAbi, superfluidConfig?.host_addr);
        const sfResolver = new web3.eth.Contract(SuperfluidResolverAbi, superfluidConfig?.resolver);
        const sfVersion = superfluidConfig.version;
        const cfaHash = id(`org.superfluid-finance.agreements.ConstantFlowAgreement.${sfVersion}`);
        const cfaAddress = await sfHost.methods.getAgreementClass(cfaHash).call();
        const sfCFA = new web3.eth.Contract(ConstantFlowAgreementAbi, cfaAddress);
        const streams = await graphFetchAll({
          endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
          query: SUPERFLUID_MINION_STREAMS,
          variables: {
            minionId: `${molochAddress}-minion-${minion}`,
          },
          subfield: 'minionStreams',
        });
        if (!streams.length) {
          return {
            flows: [],
            superTokens: null,
          };
        }
        const superTokens = await getSuperTokenBalances(
          chainID,
          minion,
          sfResolver,
          sfVersion,
          Array(
            ...new Set(
              streams.filter((s) => s.executed).map((s) => s.superTokenAddress),
            ),
          ),
        );
        const now = new Date();
        const flows = await Promise.all(
          streams.map(async (stream, i) => {
            if (stream.executed) {
              const decimals = superTokens[stream.superTokenAddress]?.decimals;
              // looks for open stream with the same token
              const nextStream = i + 1 < streams.length && streams.slice(i + 1).find(
                (s) => s.tokenAddress === stream.tokenAddress && s.sender === stream.sender && s.receiver === stream.receiver,
              );
              // looks for stopped stream events where (stream.executedBlock < block < nextStream.executedBlock)
              const events = nextStream && await sfCFA.getPastEvents('FlowUpdated', {
                fromBlock: +stream.executedBlock + 1,
                toBlock: nextStream?.executedBlock ? (+nextStream.executedBlock - 1) : 'latest',
                filter: {
                  token: stream.superTokenAddress,
                  sender: minion,
                  receiver: stream.to,
                },
              });
              if (events?.length > 0) {
                // Stream was stopped or liquidated
                const block = await web3.eth.getBlock(events[0].blockNumber);
                const netFlow = (+stream.rate * (block?.timestamp - stream.executedAt)) / (10 ** decimals);
                return {
                  ...stream,
                  liquidated: stream.active,
                  netFlow,
                };
              }
              if (stream.active) {
                const netFlow = (+stream.rate * ((now - new Date(stream.executedAt * 1000)) / 1000)) / (10 ** decimals);
                return {
                  ...stream,
                  netFlow,
                };
              }
              const netFlow = (+stream.rate * (+stream.canceledAt - +stream.executedAt)) / (10 ** decimals);
              return {
                ...stream,
                netFlow,
              };
            }
            return {
              ...stream,
            };
          }),
        );
        return {
          flows: flows.sort((a, b) => b.createdAt - a.createdAt),
          superTokens,
        };
      };
    }
    if (service === 'hasActiveStreams') {
      return async ({ molochAddress, tokenAddress, to }) => {
        const streams = await graphFetchAll({
          endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
          query: SUPERFLUID_ACTIVE_STREAMS_TO,
          variables: {
            minionId: `${molochAddress}-minion-${minion}`,
            tokenAddress,
            to,
          },
          subfield: 'minionStreams',
        });
        return streams.length > 0;
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
    // withdrawRemainingFunds args: | superToken |
    if (
      service === 'proposeStream'
      || service === 'executeAction'
      || service === 'cancelAction'
      || service === 'cancelStream'
      || service === 'withdrawRemainingFunds'
    ) {
      return async ({
        args, address, poll, onTxHash,
      }) => {
        const tx = await minionContract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', (txHash) => {
            if (poll) {
              onTxHash();
              poll(txHash);
            }
          })
          .on('error', (error) => {
            console.error(error);
          });
      };
    }
  };
};
