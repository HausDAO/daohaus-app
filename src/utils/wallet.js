import { TokenService } from '../services/tokenService';

export const initMemberWallet = async ({
  memberAddress,
  daoAddress,
  chainID,
  depositToken,
}) => {
  const { decimals, symbol } = depositToken;
  const depositTokenContract = TokenService({
    chainID,
    tokenAddress: depositToken.tokenAddress,
  });

  const balance = await depositTokenContract('balanceOf')(memberAddress);

  const allowance = await depositTokenContract('allowance')({
    accountAddr: memberAddress,
    contractAddr: daoAddress,
  });

  const depositTokenData = {
    decimals,
    balance,
    allowance,
    symbol,
  };

  return {
    depositTokenData,
  };
};
