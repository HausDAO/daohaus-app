// SAVE FOR LATER
import Web3 from 'web3';

// import Erc20Abi from '../contracts/erc20a.json';
import { getLocalABI } from './abi';
import { chainByID } from './chain';
import { CONTRACTS } from '../data/contracts';

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

export const getNftUri = async (
  daochain,
  injectedProvider,
  contractAbi,
  getterName,
  contractAddress,
  tokenId,
) => {
  try {
    const contract = await createContract({
      address: contractAddress,
      abi: contractAbi,
      chainID: daochain,
      web3: injectedProvider,
    });
    return await contract.methods[getterName](tokenId).call();
  } catch (error) {
    console.error('Error trying to fetch URI using', getterName, error);
  }
};

export const getNftType = async (
  daochain,
  injectedProvider,
  contractAddress,
  tokenId,
) => {
  const erc721Uri = await getNftUri(
    daochain,
    injectedProvider,
    getLocalABI(CONTRACTS.LOCAL_ERC_721),
    'tokenURI',
    contractAddress,
    tokenId,
  );
  if (erc721Uri) return 'ERC721';
  const erc1155Uri = await getNftUri(
    daochain,
    injectedProvider,
    getLocalABI(CONTRACTS.LOCAL_ERC_1155_METADATA),
    'uri',
    contractAddress,
    tokenId,
  );
  if (erc1155Uri) return 'ERC1155';
  throw new Error('Not an NFT');
};
