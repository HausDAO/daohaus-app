import Web3 from 'web3';

import MinionAbi from '../contracts/minion.json';
import MinionNiftyAbi from '../contracts/minionNifty.json';
import { chainByID } from '../utils/chain';

export const MinionService = ({ web3, minion, chainID, minionType }) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  console.log('minionType', minionType);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  let abi;

  if (minionType === 'niftyMinion') {
    console.log('minion nifty abi');
    abi = MinionNiftyAbi;
  } else {
    abi = MinionAbi;
  }
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
      service === 'crossWithdraw' ||
      service === 'cancelAction'
    ) {
      return async ({ args, address, poll, onTxHash }) => {
        console.log('minion async');
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
