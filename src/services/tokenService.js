import Web3 from 'web3';

import Erc20Abi from '../contracts/erc20a.json';
import Erc20Bytes32Abi from '../contracts/erc20Bytes32.json';
import { chainByID } from '../utils/chain';

export const TokenService = ({
  web3,
  chainID,
  tokenAddress,
  is32 = false,
  atBlock = 'latest',
}) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = is32 ? Erc20Bytes32Abi : Erc20Abi;

  const contract = new web3.eth.Contract(abi, tokenAddress);
  return service => {
    if (service === 'symbol') {
      return async () => {
        try {
          const symbol = await contract.methods.symbol().call();
          return symbol;
        } catch (error) {
          console.error(error);
        }
      };
    }
    if (service === 'decimals') {
      return async () => {
        try {
          const decimals = await contract.methods.decimals().call();
          return decimals;
        } catch (error) {
          console.error(error);
        }
      };
    }
    if (service === 'balanceOf') {
      return async queryAddress => {
        try {
          const balance = await contract.methods
            .balanceOf(queryAddress)
            .call({}, atBlock);
          return balance;
        } catch (error) {
          console.error(error);
        }
      };
    }
    if (service === 'allowance') {
      return async ({ accountAddr, contractAddr }) => {
        try {
          const allowance = await contract.methods
            .allowance(accountAddr, contractAddr)
            .call();
          return allowance;
        } catch (error) {
          console.error(error);
        }
      };
    }
    if (service === 'approve') {
      return async ({ args, address, poll }) => {
        const tx = await contract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              poll(txHash);
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
    if (service === 'transferNoop') {
      return ({ to, amount }) => {
        console.log('args', to, amount);

        const tx = contract.methods.transfer(to, amount);
        return tx.encodeABI();
      };
    }
  };
};
