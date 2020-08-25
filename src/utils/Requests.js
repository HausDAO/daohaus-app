import axios from 'axios';
import supportedChains from './chains';

const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

export const BaseUrl = () => {
  return chainData.api_url;
};

export const get = async (endpoint) => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    return await instance.get(`/${endpoint}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const post = async (endpoint, payload) => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    return await instance.post(`/${endpoint}`, payload);
  } catch (err) {
    return err.response;
  }
};

export const put = async (endpoint, payload) => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    return await instance.put(`/${endpoint}`, payload);
  } catch (err) {
    throw new Error(err);
  }
};

export const remove = async (endpoint) => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    return await instance.delete(`/${endpoint}`);
  } catch (err) {
    throw new Error(err);
  }
};
