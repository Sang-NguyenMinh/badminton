import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

export const ConservationAPIs = {
  ENDPOINT: EXPO_PUBLIC_API_URL,
  getConservations: async (): Promise<any> => {
    return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/conversations`, {
      requiresToken: true,
    } as AxiosRequestConfig);
  },
};
