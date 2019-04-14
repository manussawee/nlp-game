import axios from 'axios';

import config from '../config';

const getAccessToken = () => {
  return window.localStorage.getItem('access_token');
};

const setAccessToken = (accessToken) => {
  window.localStorage.setItem('access_token', accessToken);
};

const get = (url, params = {}) => {
  return axios.get(`${config.api}${url}`, {
      params: {
        ...params,
        access_token: getAccessToken(),
      },
  });
};

const post = (url, data = {}) => {
  return axios.post(`${config.api}${url}?access_token=${getAccessToken()}`, data);
};

const api = {
  get,
  post,
  setAccessToken,
  getAccessToken,
};

export default api;
