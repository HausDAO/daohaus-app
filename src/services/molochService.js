import Web3 from 'web3';

import DaoAbi from '../contracts/mcdao.json';
import DaoAbiV2 from '../contracts/molochV2.json';
import { chainByID } from '../utils/chain';

export const MolochService = ({ web3, daoAddress, version, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = version >= 2 ? DaoAbiV2 : DaoAbi;
  const contract = new web3.eth.Contract(abi, daoAddress);

  return function getService(service) {
    if (service === 'getUserTokenBalance') {
      return async ({ userAddress, tokenAddress }) => {
        const balance = await contract.methods
          .getUserTokenBalance(userAddress, tokenAddress)
          .call();
        return balance;
      };
    }
    if (service === 'members') {
      return async memberAddress => {
        const member = await contract.methods.members(memberAddress).call();
        return member;
      };
    }
    if (service === 'canRagequit') {
      return async highestIndexYesVote => {
        const canRage = await contract.methods
          .canRagequit(highestIndexYesVote)
          .call();
        return canRage;
      };
    }
    if (service === 'memberAddressByDelegateKey') {
      return async memberAddress => {
        const address = await contract.methods
          .memberAddressByDelegateKey(memberAddress)
          .call();
        return address.toLowerCase();
      };
    }
    if (
      service === 'submitProposal' ||
      service === 'sponsorProposal' ||
      service === 'cancelProposal' ||
      service === 'submitVote' ||
      service === 'processProposal' ||
      service === 'processWhitelistProposal' ||
      service === 'processGuildKickProposal' ||
      service === 'submitWhitelistProposal' ||
      service === 'submitGuildKickProposal' ||
      service === 'collectTokens' ||
      service === 'withdrawBalance' ||
      service === 'ragequit' ||
      service === 'ragekick' ||
      service === 'updateDelegateKey'
    ) {
      return async ({ args, address, poll, onTxHash }) => {
        try {
          const tx = await contract.methods[service](...args);
          return tx
            .send('eth_requestAccounts', { from: address })
            .on('transactionHash', txHash => {
              console.log('transactionHash');
              if (poll) {
                poll(txHash);
              }
              if (onTxHash) {
                onTxHash();
              }
              return txHash;
            })
            .on('error', error => {
              console.error('This was not caught by component', error);
              return error;
            });
        } catch (error) {
          console.error(error);
          return error;
        }
      };
    }
    return null;
  };
};
