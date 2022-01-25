import { createContract } from './contract';
import { LOCAL_ABI } from './abi';

export const initMemberWallet = async ({
  memberAddress,
  daoAddress,
  chainID,
  depositToken,
}) => {
  const tokenContract = createContract({
    address: depositToken.tokenAddress,
    abi: LOCAL_ABI.ERC_20,
    chainID,
  });

  const tokenBalance = await tokenContract.methods
    .balanceOf(memberAddress)
    .call();

  const allowance = await tokenContract.methods
    .allowance(memberAddress, daoAddress)
    .call();

  return {
    depositTokenBalance: tokenBalance,
    allowance: allowance / 10 ** depositToken.decimals,
  };
};
