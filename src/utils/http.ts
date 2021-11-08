import axios from 'axios';

/** @internal */
export const http = axios.create({
  baseURL: 'https://kessel-api.parsecgaming.com'
});
