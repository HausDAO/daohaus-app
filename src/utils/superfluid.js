import { SF_SUPERTOKEN, SF_SUPERTOKEN_V2 } from '../graphQL/superfluid-queries';
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
      console.log('USING V2...');
      const superTokenInfo = await graphQuery({
        endpoint: superfluidConfig.subgraph_url_v2,
        query: SF_SUPERTOKEN_V2,
        variables: {
          tokenAddress: underlyingTokenAddress,
        },
      });
      console.log('SuperToken?', superTokenInfo);
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
    console.log('SuperToken?', superTokenInfo);
    return superTokenInfo.superToken.length
      ? superTokenInfo.superToken[0]
      : superTokenInfo.superTokenOf?.[0];
  } catch (error) {
    console.error(error);
  }
};

export const isSupertoken = async (chainId, tokenAddress, useV2 = false) => {
  const superTokenInfo = await getSupertokenOf(chainId, tokenAddress, useV2);
  return {
    superTokenAddress: superTokenInfo?.address,
    isSuperToken: superTokenInfo?.address === tokenAddress,
  };
};
