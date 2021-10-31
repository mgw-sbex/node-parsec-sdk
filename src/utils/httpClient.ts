import axios from 'axios';

/** @internal */
export const httpClient = axios.create({
  baseURL: 'https://kessel-api.parsecgaming.com'
});
