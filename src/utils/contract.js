// SAVE FOR LATER

import Web3 from 'web3';

// import Erc20Abi from '../contracts/erc20a.json';
import { chainByID } from './chain';

export const createContract = ({ address, abi, chainID, web3 }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  return new web3.eth.Contract(abi, address);
};

// const compareAttributes = (comparisonType, { contract, abi }) => {
//   console.log(contract);
//   console.log(abi);
//   // if(comparisonType === 'ABI=>Contract' ){
//   //   const abiKeys = abi.filter(fn => fn.type==='function').map(fn => fn.name)
//   //   const
//   // }
// };

// export const checkContractType = ({ contractType, address, chainID }) => {
//   // check if there's a local ABI

//   if (!contractType || !address || chainID) {
//     console.log(`contractType`, contractType);
//     console.log(`address`, address);
//     console.log(`chainID`, chainID);
//     throw new Error(
//       'Did not recieve the correct params for checkContractType() in contract.js ',
//     );
//   }
//   const localABIs = {
//     erc20: Erc20Abi,
//     //  Add as needed
//   };

//   if (localABIs[contractType]) {
//     const abi = localABIs[erc20];
//     const contract = createContract({ address, chainID, abi });
//     const isContractType = compareAttributes('ABI=>Contract', {
//       contract,
//       abi,
//     });
//   }
//   // create an list of methonds from the localABI
//   // for every item on the list, check to make sure the contract has all of these items on the list.
// };

// const test = () => {
//   checkContractType('');
// };

// test();
