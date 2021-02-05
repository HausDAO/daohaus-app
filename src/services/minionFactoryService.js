import Web3 from 'web3';

import MinionFactoryAbi from '../contracts/minionFactory.json';
import { chainByID } from '../utils/chain';

export const MinionFactoryService = ({ web3, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = MinionFactoryAbi;
  const contract = new web3.eth.Contract(
    abi,
    chainByID(chainID).moloch_factory_addr,
  );
  return (service) => {
    if (service === 'summonMinion') {
      return async ({ args, from, poll, onTxHash }) => {
        try {
          const tx = await contract.methods[service](...args);
          return tx
            .send({ from })
            .on('transactionHash', (txHash) => {
              if (poll) {
                onTxHash(txHash);
                poll(txHash);
              }
            })
            .on('error', (error) => {
              console.error(error);
            });
        } catch (error) {
          return error;
        }
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
