import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://kessel-api.parsecgaming.com'
});
