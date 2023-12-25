/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios';
import { IAxios } from '../interfaces/axios/IAxios';

export const useAxios = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const GET = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>,
  ): Promise<AxiosResponse<R>> => {
    // console.log('args', args);

    return instance({
      ...args,
      method: 'GET',
    });
  };
  const POST = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>,
  ): Promise<AxiosResponse<R>> => {
    // try {
    //   return await instance({
    //     ...args,
    //     method: 'POST',
    //   });
    // } catch (e) {
    //   throw e;
    // }
    return instance({
      ...args,
      method: 'POST',
    });
  };

  const PUT = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return instance({
      ...args,
      method: 'PUT',
    });
  };

  const DELETE = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return instance({
      ...args,
      method: 'DELETE',
    });
  };

  return {
    instance,
    GET,
    POST,
    PUT,
    DELETE,
  };
};
