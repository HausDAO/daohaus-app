import { utils } from 'web3';
import { TokenService } from '../services/tokenService';

export const initMemberWallet = async ({
  memberAddress,
  daoAddress,
  chainID,
  depositToken,
}) => {
  // TODO handle tokens with different decimals

  const depositTokenContract = TokenService({
    chainID,
    tokenAddress: depositToken.tokenAddress,
  });
  const tokenBalance = utils.fromWei(
    await depositTokenContract('balanceOf')(memberAddress),
  );
  const allowance = utils.fromWei(
    await depositTokenContract('allowance')({
      accountAddr: memberAddress,
      contractAddr: daoAddress,
    }),
  );

  return {
    depositTokenBalance: tokenBalance,
    allowance,
  };
};
