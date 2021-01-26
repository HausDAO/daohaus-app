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
  return (service) => {
    if (service === 'balanceOf') {
      return async (queryAddress) => {
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
  };
};

// export class TokenService {
//   web3;
//   contract;
//   daoAddress;
//   accountAddress;

//   constructor(web3, daoToken, daoAddress, accountAddress) {
//     this.web3 = web3;
//     this.contract = new web3.eth.Contract(Erc20Abi, daoToken);
//     this.contract32 = new web3.eth.Contract(Erc20Bytes32Abi, daoToken);
//     this.daoAddress = daoAddress;
//     this.accountAddress = accountAddress;
//   }

//   async getSymbol(override) {
//     let symbol;

//     if (override) {
//       return override;
//     }

//     try {
//       symbol = await this.contract.methods.symbol().call();
//     } catch {
//       try {
//         symbol = await this.contract32.methods.symbol().call();
//       } catch {
//         symbol = "unknown";
//       }
//     }

//     if (symbol.indexOf("0x") > -1) {
//       symbol = this.web3.utils.hexToUtf8(symbol);
//     }

//     return symbol;
//   }

//   async getDecimals() {
//     let decimals;

//     try {
//       decimals = await this.contract.methods.decimals().call();
//       return decimals;
//     } catch {
//       return 18;
//     }
//   }

//   async totalSupply(token) {
//     const contract = token
//       ? new this.web3.eth.Contract(Erc20Abi, token)
//       : this.contract;
//     const totalSupply = await contract.methods.totalSupply().call();
//     return totalSupply;
//   }

//   async balanceOf(
//     account = this.accountAddress,
//     atBlock = "latest",
//     token = null
//   ) {
//     const contract = token
//       ? new this.web3.eth.Contract(Erc20Abi, token)
//       : this.contract;

//     const balanceOf = await contract.methods
//       .balanceOf(account)
//       .call({}, atBlock);

//     return balanceOf;
//   }

//   async balanceOfToken(token) {
//     if (!token) {
//       return;
//     }
//     const contract = new this.web3.eth.Contract(Erc20Abi, token);

//     const balanceOf = await contract.methods
//       .balanceOf(this.accountAddress)
//       .call({});
//     const decimals = await contract.methods.decimals().call();

//     return balanceOf / 10 ** decimals;
//   }

//   async allowance(
//     accountAddr = this.accountAddress,
//     contractAddr = this.daoAddress
//   ) {
//     const allowance = await this.contract.methods
//       .allowance(accountAddr, contractAddr)
//       .call();
//     return allowance;
//   }
// }
