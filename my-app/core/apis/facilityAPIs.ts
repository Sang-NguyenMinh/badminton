import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";

export const FacilityAPIs = {
    ENDPOINT: EXPO_PUBLIC_API_URL,

    //todo
    getFacilities: async  (params: {current?: number, pageSize?: number , keyword?: string}): Promise<any> => {
      return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/facilities`,params, { requiresToken: true } as AxiosRequestConfig);
    },
    getWorkingHours: async  (id:string): Promise<any> => {
      return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/facilities/${id}/working-hours`, { requiresToken: true } as AxiosRequestConfig);
    },
    getCourtsByFacilityId: async  (id:string): Promise<any> => {
      return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/facilities/${id}/courts`, { requiresToken: true } as AxiosRequestConfig);
    },

    getFacilyByPhone: async  (phone?:string): Promise<any> => {
      return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/facilities/by-phone/?phone=${phone}`, { requiresToken: false } as AxiosRequestConfig);
    },


  }