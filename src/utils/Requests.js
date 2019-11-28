import axios from "axios";
import config from "../config";

export const BaseUrl = () => {
  return config.API;
};

export const get = async endpoint => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" }
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
    headers: { "Content-Type": "application/json" }
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
    headers: { "Content-Type": "application/json" }
  });
  try {
    return await instance.put(`/${endpoint}`, payload);
  } catch (err) {
    throw new Error(err);
  }
};

export const remove = async endpoint => {
  const baseURL = BaseUrl();

  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" }
  });
  try {
    return await instance.delete(`/${endpoint}`);
  } catch (err) {
    throw new Error(err);
  }
};