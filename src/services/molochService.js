import Web3 from 'web3';

import DaoAbi from '../contracts/mcdao.json';
import DaoAbiV2 from '../contracts/molochV2.json';
import { chainByID } from '../utils/chain';

export const MolochService = ({ web3, daoAddress, version, chainID }) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = version >= 2 ? DaoAbiV2 : DaoAbi;
  const contract = new web3.eth.Contract(abi, daoAddress);

  return function getService(service) {
    // console.log('service', service);

    if (service === 'getUserTokenBalance') {
      return async ({ userAddress, tokenAddress }) => {
        const balance = await contract.methods
          .getUserTokenBalance(userAddress, tokenAddress)
          .call();
        return balance;
      };
    }
    if (service === 'members') {
      return async (memberAddress) => {
        const member = await contract.methods.members(memberAddress).call();
        return member;
      };
    }
    if (service === 'memberAddressByDelegateKey') {
      return async (memberAddress) => {
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
      service === 'submitGuildKickProposal'
    ) {
      return async ({ args, address, poll, onTxHash, onTxError }) => {
        // console.log('args', args);
        // console.log('from', address);
        // console.log('poll', poll);
        try {
          const tx = await contract.methods[service](...args);
          return tx
            .send('eth_requestAccounts', { from: address })
            .on('transactionHash', (txHash) => {
              if (poll) {
                onTxHash();
                poll(txHash);
              }
              return txHash;
            })
            .on('error', (error) => {
              if (onTxError) {
                onTxError(error);
              }
              console.error(error);
            });
        } catch (error) {
          return error;
        }
      };
    }
  };
};
