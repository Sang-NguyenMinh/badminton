
import { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_ROOT_API_URL } from '@/configs/config';
import { AxiosRequestConfig } from 'axios';
import axiosCustome from '../libs/axios';

// export interface IRegisterProfile {
//     firstName?: string;
//     lastName?: string;
//     contactInfo?: {
//         phone?: string;
//         email?: string;
//     };
//     identityCode?: string;
//     referrer?: string;
//     note?: string;
// }

export const AuthAPI = {
  ENDPOINT: EXPO_PUBLIC_API_URL,
  login: async (data: { username: string, password: string }): Promise<any> => {
    console.log(EXPO_PUBLIC_API_URL)
    return axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/auth/login`, data, { requiresToken: false } as AxiosRequestConfig);
  },

  loginWithGG: async (): Promise<any> => {
    return axiosCustome.get<any>(`${EXPO_PUBLIC_ROOT_API_URL}`, { requiresToken: false } as AxiosRequestConfig);
  },

  resgister: async (data: { username: string, password: string, email:string }): Promise<any> => {
    return axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/auth/register`, data, { requiresToken: false } as AxiosRequestConfig);
  },

  checkCode: async (data: { _id:string, code:string }): Promise<any> => {
    return axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/auth/check-code`, data, { requiresToken: false } as AxiosRequestConfig);
  },

  reSendCode: async (email:string): Promise<any> => {
    return axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/auth/retry-active`, {email}, { requiresToken: false } as AxiosRequestConfig);
  },


  // refreshToken: function (refreshToken: string) {
  //     return axios.post(`${this.ENDPOINT}/refresh-token`, { refreshToken });
  // },

  // sendVerificationEmail: (email: string) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/email-verification-sending`, { email });
  // },

  // loginWithThirdParty: (data: any, type: 'facebook' | 'apple') => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/login/${type}`, data);
  // },

  // registerWithThirdParty: (data: any, type: 'facebook' | 'apple', profileData: IRegisterProfile) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/register/${type}`, {
  //         ...data,
  //         profileData,
  //     });
  // },

  // sendVerificationEmail: (email: string) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/email-verification-sending`, { email });
  // },

  // verifyEmail: (code: string) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/email-verification`, { code });
  // },

  // sendRecoveryEmail: (email: string) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/password-recovery-sending`, { email });
  // },

  // requestActivation: (email: string) => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/email-activation-request`, { email });
  // },

  // logOut: () => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/logout`);
  // },

  // deleteAccount: () => {
  //     return axios.post(`${EXPO_PUBLIC_API_URL}/auth/delete`);
  // },
};
