import {
  SF_ACTIVE_STREAMS,
  SF_ACTIVE_STREAMS_V2,
  SF_SUPERTOKEN,
  SF_SUPERTOKEN_V2,
} from '../graphQL/superfluid-queries';
import { graphQuery } from './apollo';
import { chainByID } from './chain';

export const getSupertokenOf = async (
  chainId,
  underlyingTokenAddress,
  useV2,
) => {
  try {
    const superfluidConfig = chainByID(chainId).superfluid;
    if (!superfluidConfig) {
      // TODO: raise exception
    }
    if (useV2) {
      const superTokenInfo = await graphQuery({
        endpoint: superfluidConfig.subgraph_url_v2,
        query: SF_SUPERTOKEN_V2,
        variables: {
          tokenAddress: underlyingTokenAddress,
        },
      });
      return superTokenInfo.superToken?.[0]?.isSuperToken
        ? superTokenInfo.superToken[0]
        : superTokenInfo.superTokenOf?.[0];
    }
    const superTokenInfo = await graphQuery({
      endpoint: superfluidConfig.subgraph_url,
      query: SF_SUPERTOKEN,
      variables: {
        tokenAddress: underlyingTokenAddress,
      },
    });
    return superTokenInfo.superToken.length
      ? superTokenInfo.superToken[0]
      : superTokenInfo.superTokenOf?.[0];
  } catch (error) {
    console.error(error);
  }
};

export const isSupertoken = async (chainId, tokenAddress, useV2 = false) => {
  const superTokenInfo = await getSupertokenOf(chainId, tokenAddress, useV2);
  const config = chainByID(chainId);
  return {
    superTokenAddress: superTokenInfo?.address,
    isSuperToken: superTokenInfo?.address === tokenAddress,
    isNativeWrapper: config.wrapper_contract.toLowerCase() === tokenAddress,
  };
};

export const fetchActiveStream = async (
  chainId,
  ownerAddress,
  paymentToken,
  recipientAddress,
  useV2,
) => {
  const superfluidConfig = chainByID(chainId).superfluid;
  if (!superfluidConfig) {
    // TODO: raise exception
  }
  if (useV2) {
    const superToken = await getSupertokenOf(chainId, paymentToken, useV2);
    if (!superToken) return;
    const accountStreams = await graphQuery({
      endpoint: superfluidConfig.subgraph_url_v2,
      query: SF_ACTIVE_STREAMS_V2,
      variables: {
        ownerAddress,
        supertokenAddress: superToken.address,
        recipientAddress,
      },
    });
    const stream = accountStreams?.streams?.[0];

    return Number(stream?.currentFlowRate) > 0 && stream;
  }
  const accountStreams = await graphQuery({
    endpoint: superfluidConfig.subgraph_url,
    query: SF_ACTIVE_STREAMS,
    variables: {
      ownerAddress,
      recipientAddress,
    },
  });

  return accountStreams?.account?.flowsOwned?.find(
    s => s.token?.underlyingAddress === paymentToken,
  );
};
