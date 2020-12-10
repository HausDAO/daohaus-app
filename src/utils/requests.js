// import axios from 'axios';
import supportedChains from './chains';

const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];
const geckoURL = 'https://api.coingecko.com/api/v3/simple/token_price';
const uniswapGhList = 'https://raw.githubusercontent.com';

// export const BaseUrl = () => {
//   return chainData.api_url;
// };

export const get = async (endpoint, data) => {
  const url = `${chainData.metadata_api_url}/${endpoint}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const post = async (endpoint, data) => {
  const url = `${chainData.metadata_api_url}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const put = async (endpoint, data) => {
  const url = `${chainData.metadata_api_url}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

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

// export const get = async (endpoint) => {
//   const baseURL = BaseUrl();

//   const instance = axios.create({
//     baseURL,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   try {
//     return await instance.get(`/${endpoint}`);
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// export const post = async (endpoint, payload) => {
//   const baseURL = BaseUrl();

//   const instance = axios.create({
//     baseURL,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   try {
//     return await instance.post(`/${endpoint}`, payload);
//   } catch (err) {
//     return err.response;
//   }
// };

// export const put = async (endpoint, payload) => {
//   const baseURL = BaseUrl();

//   const instance = axios.create({
//     baseURL,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   try {
//     return await instance.put(`/${endpoint}`, payload);
//   } catch (err) {
//     throw new Error(err);
//   }
// };
