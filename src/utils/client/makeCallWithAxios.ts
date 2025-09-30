import axios, { AxiosRequestConfig } from 'axios';

interface MakeCallWithAxiosProps {
 token: string;
}

export function makeCallWithAxios({ token, ...config }: MakeCallWithAxiosProps & AxiosRequestConfig) {
 const axiosInstance = axios.request({
  ...config,
  headers: {
   ...config.headers,
   'Authorization': `Bearer ${token}`,
  },
 }).then((response) => {
  return {
   error: null,
   status: true,
   data: response.data,
  };
 }).catch((error) => {
  return {
   error: error.message,
   status: false,
   data: null,
  };
 });

 return axiosInstance;
}