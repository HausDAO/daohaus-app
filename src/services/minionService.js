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
    if (service === 'propose' || service === 'executeAction') {
      return async ({ args, address, poll, onTxHash }) => {
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
    // if (service === 'memberAddressByDelegateKey') {
    //   return async (memberAddress) => {
    //     const address = await contract.methods
    //       .memberAddressByDelegateKey(memberAddress)
    //       .call();
    //     return address.toLowerCase();
    //   };
    // }
    // if (
    //   service === 'submitProposal' ||
    //   service === 'sponsorProposal' ||
    //   service === 'cancelProposal' ||
    //   service === 'submitVote' ||
    //   service === 'processProposal' ||
    //   service === 'processWhitelistProposal' ||
    //   service === 'processGuildKickProposal' ||
    //   service === 'submitWhitelistProposal' ||
    //   service === 'submitGuildKickProposal'
    // ) {
    //   return async ({ args, address, poll, onTxHash }) => {
    //     // console.log('args', args);
    //     // console.log('from', address);
    //     // console.log('poll', poll);
    //     const tx = await contract.methods[service](...args);
    //     return tx
    //       .send('eth_requestAccounts', { from: address })
    //       .on('transactionHash', (txHash) => {
    //         if (poll) {
    //           onTxHash();
    //           poll(txHash);
    //         }
    //       })
    //       .on('error', (error) => {
    //         console.error(error);
    //       });
    //   };
    // }
  };
};

// import abi from '../contracts/minion.json';

// export class MinionService {
//   web3;
//   contract;
//   daoAddress;
//   accountAddress;
//   setupValues;

//   constructor(web3, accountAddress, setupValues) {
//     this.web3 = web3;
//     this.contract = new web3.eth.Contract(abi, setupValues.minion);
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

//   async propose(actionTo, actionValue, actionData, description, callback) {
//     console.log(
//       'service',
//       actionTo,
//       actionValue,
//       actionData,
//       this.accountAddress,
//       description,
//     );

//     const txReceipt = await this.sendTx(
//       {
//         from: this.accountAddress,
//         name: 'proposeAction',
//         params: [actionTo, actionVlaue, actionData, description],
//       },
//       callback,
//     );
//     return txReceipt.transactionHash;
//   }

//   async executeAction(proposalId, callback) {
//     const txReceipt = await this.sendTx(
//       {
//         from: this.accountAddress,
//         name: 'executeAction',
//         params: [proposalId],
//       },
//       callback,
//     );
//     return txReceipt.transactionHash;
//   }

//   async getAction(proposalId) {
//     let action;
//     try {
//       action = await this.contract.methods.actions(proposalId).call();
//       return action;
//     } catch {
//       return undefined;
//     }
//   }
// }
