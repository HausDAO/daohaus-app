import Web3 from 'web3';

import MinionAbi from '../contracts/minion.json';
import { chainByID } from '../utils/chain';

export const MinionService = ({ web3, minion, chainID }) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = MinionAbi;
  const contract = new web3.eth.Contract(abi, minion);

  return function getService(service) {
    // console.log('service', service);
    if (service === 'getAction') {
      return async ({ proposalId }) => {
        const action = await contract.methods.actions(proposalId).call();
        return action;
      };
    }
    // proposeAction args: [ target contract, ether value, function call data, details ]
    // executeAction args: [ proposal id ]
    // crossWithdraw args: [ target dao address, token address, amount, transfer (bool)]
    if (
      service === 'proposeAction' ||
      service === 'executeAction' ||
      service === 'crossWithdraw'
    ) {
      return async ({ args, address, poll, onTxHash }) => {
        console.log(args);
        console.log(address);
        console.log(poll);
        console.log(service);
        const tx = await contract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              onTxHash();
              poll(txHash);
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
    return null;
  };
};
