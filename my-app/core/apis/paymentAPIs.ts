import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

interface IParamData {
  orderId: string;
  amount: number;
  orderInfo: string;
}



export enum PAYMENT_METHOD {
  CASH = 'Cash',
  MOMO = 'MoMo',
  ZALLOPAY = 'ZaloPay',
}

export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}


export const PaymentAPIs = {
  ENDPOINT: EXPO_PUBLIC_API_URL,
  createMoMoPayment: async (data: IParamData) => {
    const res = await axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/payment/create-momo-payment`, data, { requiresToken: false } as AxiosRequestConfig);

    return res;
  },

  checkPayment: async (data:{ orderId: string} ) => {
    const res = await axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/payment/verify-momo-payment`, data, { requiresToken: false } as AxiosRequestConfig);
    return res;
  },

}