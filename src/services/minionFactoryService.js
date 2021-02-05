import Web3 from 'web3';

import MinionFactoryAbi from '../contracts/minionFactory.json';
import { chainByID } from '../utils/chain';

export const MinionFactoryService = ({
  web3,
  daoAddress,
  version,
  chainID,
}) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = MinionFactoryAbi;
  const setupValues = {
    minionFactory: chainByID(chainID).minion_factory_addr,
    actionValue: '0',
  };
  const contract = new web3.eth.Contract(abi, setupValues);

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
      return async ({ args, address, poll, onTxHash }) => {
        // console.log('args', args);
        // console.log('from', address);
        // console.log('poll', poll);
        const tx = await contract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', (txHash) => {
            if (poll) {
              onTxHash();
              poll(txHash);
            }
          })
          .on('error', (error) => {
            console.error(error);
          });
      };
    }
  };
};

// import abi from '../contracts/minionFactory.json';

// export class MinionFactoryService {
//   web3;
//   contract;
//   daoAddress;
//   accountAddress;
//   setupValues;

//   constructor(web3, accountAddress, setupValues) {
//     console.log('service init', accountAddress, setupValues);
//     this.web3 = web3;
//     this.contract = new web3.eth.Contract(abi, setupValues.minionFactory);
//     this.accountAddress = accountAddress;
//     this.setupValues = setupValues;
//   }

//   // internal
//   sendTx(options, callback) {
//     const { from, name, params } = options;
//     const tx = this.contract.methods[name](...params);
//     return tx
//       .send({ from: from })
//       .on('transactionHash', (txHash) => {
//         console.log('txHash', txHash);
//         callback(txHash, options);
//       })
//       .on('error', (error) => {
//         callback(null, error);
//       });
//   }

//   async summonMinion(daoAddress, details = '', callback) {
//     const txReceipt = await this.sendTx(
//       {
//         from: this.accountAddress,
//         name: 'summonMinion',
//         params: [daoAddress, details],
//       },
//       callback,
//     );
//     return txReceipt.transactionHash;
//   }
// }
