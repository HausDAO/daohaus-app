import { TokenService } from '../services/tokenService';
import { utils } from 'web3';

export const initMemberWallet = async ({
  memberAddress,
  daoAddress,
  chainID,
  depositToken,
}) => {
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
