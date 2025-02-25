import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "./paymentAPIs";


interface CourtParams {
    id: string;
    startTime: string; 
    endTime: string;  
    price: number;
  }
  
  export interface ReservationParams {
    userId: string; 
    facility: string;                  
    status?: PAYMENT_STATUS;                
    paymentMethod: PAYMENT_METHOD;           
    totalAmount?: number;            
    courts: CourtParams[];  
    reservationDate?:string,
   
  }

export const ReservationAPIs = {
  ENDPOINT: EXPO_PUBLIC_API_URL,
  createReservation: async (data:ReservationParams) => {
    const res = await axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/reservations`, data, { requiresToken: true } as AxiosRequestConfig);
    return res;
  },

  getReservation: async (param:{current?: number,
    pageSize?: number,
    keyword?: string ,status?:string }) => {
    const res = await axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/reservations?current=${param.current??1}&pageSize=${param.pageSize??10}&keyword=${param.keyword??''}&status=${param.status??''}`, { requiresToken: true } as AxiosRequestConfig);
    return res;
  },



}