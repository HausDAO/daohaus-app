// import axios from 'axios';

const geckoURL = 'https://api.coingecko.com/api/v3/simple/token_price';
const uniswapGhList = 'https://raw.githubusercontent.com';

export const getUsd = async (tokenAddress) => {
  const url = `${geckoURL}/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getMainetAddresses = async () => {
  const url = `${uniswapGhList}/Uniswap/default-token-list/master/src/tokens/mainnet.json`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

// export const getUsd = async (tokenAddress) => {
//   const instance = axios.create({
//     baseURL: geckoURL,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   try {
//     return await instance.get(
//       `/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`,
//     );
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// export const getMainetAddresses = async () => {
//   const instance = axios.create({
//     baseURL: uniswapGhList,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   try {
//     return await instance.get(
//       `/Uniswap/default-token-list/master/src/tokens/mainnet.json`,
//     );
//   } catch (err) {
//     throw new Error(err);
//   }
// };
